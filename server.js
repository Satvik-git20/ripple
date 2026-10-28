'use strict';

const path = require('path');
const express = require('express');
const db = require('./lib/db');
const { seed } = require('./seed');
const {
  SESSION_COOKIE,
  SESSION_DAYS,
  hashPassword,
  verifyPassword,
  createToken,
  parseCookies,
  normalizeUsername,
  isUsername,
  normalizeWebsite,
} = require('./lib/auth');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const publicDir = path.join(__dirname, 'public');
const AVATAR_COLORS = new Set([
  '#FF6A4A',
  '#2A8A73',
  '#BBA9F2',
  '#F0BE4C',
  '#E58DA8',
  '#82C8B4',
  '#8FA7E8',
  '#D9A06B',
  '#C77DA8',
  '#67B7D1',
  '#E76F51',
  '#7A9E7E',
]);

const POST_SELECT = `
  SELECT
    p.id,
    p.user_id,
    p.content,
    p.created_at,
    u.username,
    u.display_name,
    u.avatar_color,
    (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count,
    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
    EXISTS(
      SELECT 1 FROM likes l2
      WHERE l2.post_id = p.id AND l2.user_id = ?
    ) AS liked
  FROM posts p
  JOIN users u ON u.id = p.user_id
`;

function nowIso() {
  return new Date().toISOString();
}

function postFromRow(row, viewerId) {
  return {
    id: row.id,
    content: row.content,
    createdAt: row.created_at,
    likeCount: Number(row.like_count),
    commentCount: Number(row.comment_count),
    liked: Boolean(row.liked),
    canDelete: row.user_id === viewerId,
    author: {
      username: row.username,
      displayName: row.display_name,
      avatarColor: row.avatar_color,
    },
  };
}

function commentFromRow(row, viewerId, postOwnerId) {
  return {
    id: row.id,
    content: row.content,
    createdAt: row.created_at,
    canDelete: row.user_id === viewerId || postOwnerId === viewerId,
    author: {
      username: row.username,
      displayName: row.display_name,
      avatarColor: row.avatar_color,
    },
  };
}

function profileFromRow(row, viewerId) {
  return {
    username: row.username,
    displayName: row.display_name,
    bio: row.bio,
    location: row.location,
    website: row.website,
    avatarColor: row.avatar_color,
    createdAt: row.created_at,
    postCount: Number(row.post_count || 0),
    followerCount: Number(row.follower_count || 0),
    followingCount: Number(row.following_count || 0),
    isFollowing: Boolean(row.is_following),
    isMe: row.id === viewerId,
  };
}

function summaryFromRow(row, viewerId) {
  return {
    username: row.username,
    displayName: row.display_name,
    bio: row.bio,
    avatarColor: row.avatar_color,
    followerCount: Number(row.follower_count || 0),
    isFollowing: Boolean(row.is_following),
    isMe: row.id === viewerId,
  };
}

function getProfile(username, viewerId) {
  const row = db
    .prepare(
      `
        SELECT
          u.*,
          (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.id) AS post_count,
          (SELECT COUNT(*) FROM follows f WHERE f.following_id = u.id) AS follower_count,
          (SELECT COUNT(*) FROM follows f WHERE f.follower_id = u.id) AS following_count,
          EXISTS(
            SELECT 1 FROM follows f
            WHERE f.follower_id = ? AND f.following_id = u.id
          ) AS is_following
        FROM users u
        WHERE u.username = ? COLLATE NOCASE
      `,
    )
    .get(viewerId, username);

  return row ? profileFromRow(row, viewerId) : null;
}

function getPost(postId, viewerId) {
  const row = db
    .prepare(`${POST_SELECT} WHERE p.id = ?`)
    .get(viewerId, postId);
  return row ? postFromRow(row, viewerId) : null;
}

function displayNameOf(user) {
  return user.display_name || user.username;
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Sign in to keep going.' });
  }
  next();
}

function text(value, maxLength, { singleLine = false } = {}) {
  let output = String(value ?? '');
  if (singleLine) output = output.replace(/\s+/g, ' ');
  output = output.trim();
  return output.slice(0, maxLength);
}

function startSession(res, userId) {
  const token = createToken();
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  db.prepare(
    'INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)',
  ).run(token, userId, createdAt, expiresAt);

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === '1',
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

seed();

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');

  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store');
  }

  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (token) {
    const row = db
      .prepare(
        `
          SELECT u.*, s.token AS session_token
          FROM sessions s
          JOIN users u ON u.id = s.user_id
          WHERE s.token = ? AND s.expires_at > ?
        `,
      )
      .get(token, nowIso());

    if (row) {
      req.user = row;
      req.sessionToken = token;
    }
  }

  next();
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/register', (req, res) => {
  const username = normalizeUsername(req.body?.username);
  const displayName = text(req.body?.displayName, 40, { singleLine: true });
  const password = String(req.body?.password ?? '');

  if (!isUsername(username)) {
    return res.status(400).json({
      error: 'Use 3–20 characters for your username: letters, numbers, or underscores.',
    });
  }
  if (displayName.length < 1) {
    return res.status(400).json({ error: 'Add a name people can call you.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Your password needs at least 8 characters.' });
  }
  if (password.length > 128) {
    return res.status(400).json({ error: 'That password is a little too long.' });
  }

  const existing = db
    .prepare('SELECT id FROM users WHERE username = ? COLLATE NOCASE')
    .get(username);
  if (existing) {
    return res.status(409).json({ error: 'That username is already taken.' });
  }

  let result;
  try {
    result = db
      .prepare(
        `
          INSERT INTO users
            (username, display_name, password_hash, bio, location, website, avatar_color, created_at)
          VALUES (?, ?, ?, '', '', '', ?, ?)
        `,
      )
      .run(
        username,
        displayName,
        hashPassword(password),
        AVATAR_COLORS.values().next().value,
        nowIso(),
      );
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      return res.status(409).json({ error: 'That username is already taken.' });
    }
    throw error;
  }

  const userId = Number(result.lastInsertRowid);
  startSession(res, userId);

  res.status(201).json({
    user: getProfile(username, userId),
  });
});

app.post('/api/auth/login', (req, res) => {
  const username = normalizeUsername(req.body?.username);
  const password = String(req.body?.password ?? '');

  if (!username || !password) {
    return res.status(400).json({ error: 'Enter your username and password.' });
  }

  const user = db
    .prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE')
    .get(username);

  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'That username and password don’t match.' });
  }

  startSession(res, user.id);
  res.json({ user: getProfile(user.username, user.id) });
});

app.post('/api/auth/logout', (req, res) => {
  if (req.sessionToken) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(req.sessionToken);
  }
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.json({ ok: true });
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ user: getProfile(req.user.username, req.user.id) });
});

app.patch('/api/me', requireAuth, (req, res) => {
  const displayName = text(req.body?.displayName, 40, { singleLine: true });
  const bio = text(req.body?.bio, 160);
  const location = text(req.body?.location, 60, { singleLine: true });
  const websiteInput = text(req.body?.website, 120, { singleLine: true });
  const website = normalizeWebsite(websiteInput);
  const avatarColor = text(req.body?.avatarColor, 7, { singleLine: true }).toUpperCase();

  if (displayName.length < 1) {
    return res.status(400).json({ error: 'Your name can’t be empty.' });
  }
  if (website === null) {
    return res.status(400).json({ error: 'That website link doesn’t look right.' });
  }
  if (!AVATAR_COLORS.has(avatarColor)) {
    return res.status(400).json({ error: 'Pick one of the available avatar colors.' });
  }

  db.prepare(
    `
      UPDATE users
      SET display_name = ?, bio = ?, location = ?, website = ?, avatar_color = ?
      WHERE id = ?
    `,
  ).run(displayName, bio, location, website, avatarColor, req.user.id);

  res.json({ user: getProfile(req.user.username, req.user.id) });
});

app.get('/api/posts', requireAuth, (req, res) => {
  const scope = req.query.scope === 'following' ? 'following' : 'all';
  const limit = 40;

  let sql = `${POST_SELECT}`;
  const params = [req.user.id];

  if (scope === 'following') {
    sql += `
      WHERE p.user_id = ?
         OR p.user_id IN (
           SELECT following_id FROM follows WHERE follower_id = ?
         )
    `;
    params.push(req.user.id, req.user.id);
  }

  sql += ' ORDER BY p.created_at DESC, p.id DESC LIMIT ?';
  params.push(limit);

  const rows = db.prepare(sql).all(...params);
  res.json({
    posts: rows.map((row) => postFromRow(row, req.user.id)),
    scope,
  });
});

app.post('/api/posts', requireAuth, (req, res) => {
  const content = text(req.body?.content, 281);
  if (!content) {
    return res.status(400).json({ error: 'Write something before posting.' });
  }
  if (content.length > 280) {
    return res.status(400).json({ error: 'Posts can be up to 280 characters.' });
  }

  const result = db
    .prepare('INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, ?)')
    .run(req.user.id, content, nowIso());

  res.status(201).json({
    post: getPost(Number(result.lastInsertRowid), req.user.id),
  });
});

app.get('/api/posts/:id', requireAuth, (req, res) => {
  const post = getPost(Number(req.params.id), req.user.id);
  if (!post) return res.status(404).json({ error: 'Post not found.' });
  res.json({ post });
});

app.delete('/api/posts/:id', requireAuth, (req, res) => {
  const post = db
    .prepare('SELECT id, user_id FROM posts WHERE id = ?')
    .get(Number(req.params.id));

  if (!post) return res.status(404).json({ error: 'Post not found.' });
  if (post.user_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete your own posts.' });
  }

  db.prepare('DELETE FROM posts WHERE id = ?').run(post.id);
  res.json({ ok: true });
});

app.post('/api/posts/:id/like', requireAuth, (req, res) => {
  const postId = Number(req.params.id);
  const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(postId);
  if (!post) return res.status(404).json({ error: 'Post not found.' });

  const existing = db
    .prepare('SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?')
    .get(req.user.id, postId);

  if (existing) {
    db.prepare('DELETE FROM likes WHERE user_id = ? AND post_id = ?').run(
      req.user.id,
      postId,
    );
  } else {
    db.prepare(
      'INSERT INTO likes (user_id, post_id, created_at) VALUES (?, ?, ?)',
    ).run(req.user.id, postId, nowIso());
  }

  const likeCount = db
    .prepare('SELECT COUNT(*) AS count FROM likes WHERE post_id = ?')
    .get(postId).count;

  res.json({ liked: !existing, likeCount: Number(likeCount) });
});

app.get('/api/posts/:id/comments', requireAuth, (req, res) => {
  const postId = Number(req.params.id);
  const post = db
    .prepare('SELECT id, user_id FROM posts WHERE id = ?')
    .get(postId);
  if (!post) return res.status(404).json({ error: 'Post not found.' });

  const rows = db
    .prepare(
      `
        SELECT c.id, c.user_id, c.content, c.created_at,
               u.username, u.display_name, u.avatar_color
        FROM comments c
        JOIN users u ON u.id = c.user_id
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC, c.id ASC
      `,
    )
    .all(postId);

  res.json({
    comments: rows.map((row) => commentFromRow(row, req.user.id, post.user_id)),
    commentCount: rows.length,
  });
});

app.post('/api/posts/:id/comments', requireAuth, (req, res) => {
  const postId = Number(req.params.id);
  const post = db
    .prepare('SELECT id, user_id FROM posts WHERE id = ?')
    .get(postId);
  if (!post) return res.status(404).json({ error: 'Post not found.' });

  const content = text(req.body?.content, 501);
  if (!content) {
    return res.status(400).json({ error: 'Write a comment first.' });
  }
  if (content.length > 500) {
    return res.status(400).json({ error: 'Comments can be up to 500 characters.' });
  }

  const now = nowIso();
  const result = db
    .prepare(
      'INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)',
    )
    .run(postId, req.user.id, content, now);

  const row = db
    .prepare(
      `
        SELECT c.id, c.user_id, c.content, c.created_at,
               u.username, u.display_name, u.avatar_color
        FROM comments c
        JOIN users u ON u.id = c.user_id
        WHERE c.id = ?
      `,
    )
    .get(Number(result.lastInsertRowid));

  const commentCount = db
    .prepare('SELECT COUNT(*) AS count FROM comments WHERE post_id = ?')
    .get(postId).count;

  res.status(201).json({
    comment: commentFromRow(row, req.user.id, post.user_id),
    commentCount: Number(commentCount),
  });
});

app.delete('/api/comments/:id', requireAuth, (req, res) => {
  const commentId = Number(req.params.id);
  const row = db
    .prepare(
      `
        SELECT c.id, c.user_id, p.user_id AS post_owner_id, c.post_id
        FROM comments c
        JOIN posts p ON p.id = c.post_id
        WHERE c.id = ?
      `,
    )
    .get(commentId);

  if (!row) return res.status(404).json({ error: 'Comment not found.' });
  if (row.user_id !== req.user.id && row.post_owner_id !== req.user.id) {
    return res.status(403).json({ error: 'You can’t delete this comment.' });
  }

  db.prepare('DELETE FROM comments WHERE id = ?').run(commentId);
  const commentCount = db
    .prepare('SELECT COUNT(*) AS count FROM comments WHERE post_id = ?')
    .get(row.post_id).count;

  res.json({ ok: true, commentCount: Number(commentCount) });
});

app.get('/api/users/suggestions', requireAuth, (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 4, 1), 8);
  const rows = db
    .prepare(
      `
        SELECT
          u.*,
          (SELECT COUNT(*) FROM follows f2 WHERE f2.following_id = u.id) AS follower_count,
          0 AS is_following
        FROM users u
        WHERE u.id <> ?
          AND NOT EXISTS (
            SELECT 1 FROM follows f
            WHERE f.follower_id = ? AND f.following_id = u.id
          )
        ORDER BY follower_count DESC, u.created_at ASC
        LIMIT ?
      `,
    )
    .all(req.user.id, req.user.id, limit);

  res.json({
    users: rows.map((row) => summaryFromRow(row, req.user.id)),
  });
});

app.get('/api/users/:username/followers', requireAuth, (req, res) => {
  const target = db
    .prepare('SELECT id, username FROM users WHERE username = ? COLLATE NOCASE')
    .get(req.params.username);
  if (!target) return res.status(404).json({ error: 'Profile not found.' });

  const rows = db
    .prepare(
      `
        SELECT
          u.*,
          (SELECT COUNT(*) FROM follows c WHERE c.following_id = u.id) AS follower_count,
          EXISTS(
            SELECT 1 FROM follows x
            WHERE x.follower_id = ? AND x.following_id = u.id
          ) AS is_following
        FROM follows f
        JOIN users u ON u.id = f.follower_id
        WHERE f.following_id = ?
        ORDER BY f.created_at DESC
        LIMIT 100
      `,
    )
    .all(req.user.id, target.id);

  res.json({
    kind: 'followers',
    username: target.username,
    users: rows.map((row) => summaryFromRow(row, req.user.id)),
  });
});

app.get('/api/users/:username/following', requireAuth, (req, res) => {
  const target = db
    .prepare('SELECT id, username FROM users WHERE username = ? COLLATE NOCASE')
    .get(req.params.username);
  if (!target) return res.status(404).json({ error: 'Profile not found.' });

  const rows = db
    .prepare(
      `
        SELECT
          u.*,
          (SELECT COUNT(*) FROM follows c WHERE c.following_id = u.id) AS follower_count,
          EXISTS(
            SELECT 1 FROM follows x
            WHERE x.follower_id = ? AND x.following_id = u.id
          ) AS is_following
        FROM follows f
        JOIN users u ON u.id = f.following_id
        WHERE f.follower_id = ?
        ORDER BY f.created_at DESC
        LIMIT 100
      `,
    )
    .all(req.user.id, target.id);

  res.json({
    kind: 'following',
    username: target.username,
    users: rows.map((row) => summaryFromRow(row, req.user.id)),
  });
});

app.post('/api/users/:username/follow', requireAuth, (req, res) => {
  const target = db
    .prepare('SELECT id, username FROM users WHERE username = ? COLLATE NOCASE')
    .get(req.params.username);

  if (!target) return res.status(404).json({ error: 'Profile not found.' });
  if (target.id === req.user.id) {
    return res.status(400).json({ error: 'You can’t follow yourself.' });
  }

  const existing = db
    .prepare('SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?')
    .get(req.user.id, target.id);

  if (existing) {
    db.prepare(
      'DELETE FROM follows WHERE follower_id = ? AND following_id = ?',
    ).run(req.user.id, target.id);
  } else {
    db.prepare(
      'INSERT INTO follows (follower_id, following_id, created_at) VALUES (?, ?, ?)',
    ).run(req.user.id, target.id, nowIso());
  }

  const followerCount = db
    .prepare('SELECT COUNT(*) AS count FROM follows WHERE following_id = ?')
    .get(target.id).count;

  res.json({
    following: !existing,
    followerCount: Number(followerCount),
  });
});

app.get('/api/users/:username', requireAuth, (req, res) => {
  const profile = getProfile(req.params.username, req.user.id);
  if (!profile) return res.status(404).json({ error: 'Profile not found.' });

  const target = db
    .prepare('SELECT id FROM users WHERE username = ? COLLATE NOCASE')
    .get(req.params.username);

  const postRows = db
    .prepare(
      `
        ${POST_SELECT}
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC, p.id DESC
        LIMIT 20
      `,
    )
    .all(req.user.id, target.id);

  const likedRows = db
    .prepare(
      `
        ${POST_SELECT}
        JOIN likes liked ON liked.post_id = p.id AND liked.user_id = ?
        ORDER BY liked.created_at DESC
        LIMIT 20
      `,
    )
    .all(req.user.id, target.id);

  res.json({
    user: profile,
    posts: postRows.map((row) => postFromRow(row, req.user.id)),
    likedPosts: likedRows.map((row) => postFromRow(row, req.user.id)),
  });
});

app.get('/api/search', requireAuth, (req, res) => {
  const query = text(req.query.q, 60, { singleLine: true });
  if (!query) {
    return res.json({ query: '', users: [], posts: [] });
  }

  const pattern = `%${query}%`;

  const userRows = db
    .prepare(
      `
        SELECT
          u.*,
          (SELECT COUNT(*) FROM follows f WHERE f.following_id = u.id) AS follower_count,
          EXISTS(
            SELECT 1 FROM follows x
            WHERE x.follower_id = ? AND x.following_id = u.id
          ) AS is_following
        FROM users u
        WHERE u.username LIKE ? OR u.display_name LIKE ?
        ORDER BY follower_count DESC, u.username ASC
        LIMIT 6
      `,
    )
    .all(req.user.id, pattern, pattern);

  const postRows = db
    .prepare(
      `
        ${POST_SELECT}
        WHERE p.content LIKE ?
        ORDER BY p.created_at DESC
        LIMIT 20
      `,
    )
    .all(req.user.id, pattern);

  res.json({
    query,
    users: userRows.map((row) => summaryFromRow(row, req.user.id)),
    posts: postRows.map((row) => postFromRow(row, req.user.id)),
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

app.use(express.static(publicDir, { extensions: ['html'] }));

app.use((error, req, res, next) => {
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'That request wasn’t valid JSON.' });
  }

  console.error(error);
  if (res.headersSent) return next(error);
  res.status(500).json({ error: 'Something went wrong on our side.' });
});

const cleanup = setInterval(() => {
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(nowIso());
}, 6 * 60 * 60 * 1000);
cleanup.unref();

const server = app.listen(PORT, () => {
  console.log(`ripple is running at http://localhost:${PORT}`);
  console.log(`Demo sign-in: maya / demo1234`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
