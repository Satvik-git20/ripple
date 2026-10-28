'use strict';

const db = require('./lib/db');
const { hashPassword } = require('./lib/auth');

const DEMO_PASSWORD = 'demo1234';

function minutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

function daysAgo(days) {
  return minutesAgo(days * 24 * 60);
}

const users = [
  {
    username: 'maya',
    displayName: 'Maya Chen',
    bio: 'Product designer making small things feel good. Collector of nice pens and unfinished notebooks.',
    location: 'Brooklyn, NY',
    website: 'https://maya.design',
    avatarColor: '#FF6A4A',
    joinedDaysAgo: 428,
  },
  {
    username: 'theo',
    displayName: 'Theo Martins',
    bio: 'Ceramicist. Mostly cups, occasionally chairs. Studio dog named Biscuit.',
    location: 'Lisbon, Portugal',
    website: 'https://theomakes.studio',
    avatarColor: '#2A8A73',
    joinedDaysAgo: 366,
  },
  {
    username: 'june',
    displayName: 'June Park',
    bio: 'Writer and editor. Sentences before sunrise.',
    location: 'Toronto, Canada',
    website: '',
    avatarColor: '#BBA9F2',
    joinedDaysAgo: 311,
  },
  {
    username: 'sam',
    displayName: 'Sam Okafor',
    bio: 'Field recordist, plant parent, maker of very specific playlists.',
    location: 'Portland, OR',
    website: '',
    avatarColor: '#F0BE4C',
    joinedDaysAgo: 264,
  },
  {
    username: 'lina',
    displayName: 'Lina Haddad',
    bio: 'Illustrator drawing soft edges and strange plants.',
    location: 'Mexico City',
    website: 'https://lina.ink',
    avatarColor: '#E58DA8',
    joinedDaysAgo: 198,
  },
  {
    username: 'amara',
    displayName: 'Amara Bello',
    bio: 'Learning to cook without a recipe. Occasional runner, professional taster.',
    location: 'Lagos, Nigeria',
    website: '',
    avatarColor: '#82C8B4',
    joinedDaysAgo: 151,
  },
  {
    username: 'ben',
    displayName: 'Ben Ito',
    bio: 'Building tiny games and bigger playlists. Currently very into browser toys.',
    location: 'Seattle, WA',
    website: 'https://benito.games',
    avatarColor: '#8FA7E8',
    joinedDaysAgo: 122,
  },
  {
    username: 'noah',
    displayName: 'Noah Williams',
    bio: 'Writer, editor, bench enthusiast. Making a zine about the places we sit.',
    location: 'Chicago, IL',
    website: '',
    avatarColor: '#D9A06B',
    joinedDaysAgo: 87,
  },
  {
    username: 'priya',
    displayName: 'Priya Raman',
    bio: 'Neuroscience PhD. Chronic note-taker. I will ask you about your sleep.',
    location: 'Boston, MA',
    website: '',
    avatarColor: '#C77DA8',
    joinedDaysAgo: 53,
  },
];

const posts = [
  {
    username: 'maya',
    minutesAgo: 18,
    content:
      "Spent the morning redrawing the same button until it felt less like a button and more like an invitation. Still not sure it's done, but it's honest. #design #process",
  },
  {
    username: 'sam',
    minutesAgo: 47,
    content:
      "Recorded six minutes of rain on the balcony, then put a soft synth under it. If anyone needs to focus this afternoon, it's yours. #sound #rain",
  },
  {
    username: 'june',
    minutesAgo: 95,
    content:
      "A small reminder: you don't have to finish the book you're not enjoying. The stack is tall, but your time is taller.",
  },
  {
    username: 'theo',
    minutesAgo: 130,
    content:
      "The kiln opened warm this morning. Seven cups went in, two came out whole, one came out crooked in a way I actually love. A good ratio. #clay",
  },
  {
    username: 'lina',
    minutesAgo: 185,
    content:
      "New sketchbook rule: draw the thing first, Google what it's supposed to look like second. #illustration",
  },
  {
    username: 'ben',
    minutesAgo: 260,
    content:
      "Made a tiny browser game where the only control is 'wait'. It's either a meditation or a prank. Still deciding. #gamedev",
  },
  {
    username: 'amara',
    minutesAgo: 310,
    content:
      "First time making bread without a timer, just the sound of the crust when I tapped it. Turns out my grandmother was right about everything. #baking",
  },
  {
    username: 'maya',
    minutesAgo: 420,
    content:
      "What's one tiny ritual that makes your workday feel human? I'll go first: writing tomorrow's three things on a sticky note before I close the laptop.",
  },
  {
    username: 'theo',
    minutesAgo: 540,
    content:
      "A customer bought a mug, then came back an hour later to buy a second one for her sister. That's the whole business plan, really. #smallbusiness",
  },
  {
    username: 'june',
    minutesAgo: 660,
    content:
      "Today's writing prompt, if you need one: describe a room you loved as a child using only sounds.",
  },
  {
    username: 'lina',
    minutesAgo: 840,
    content:
      "Color study from the train window. Everything was grey except one person's scarf, so the whole drawing became about that scarf. #illustration",
  },
  {
    username: 'sam',
    minutesAgo: 1080,
    content:
      'Walked to the corner store without headphones. Heard three separate birds, a squeaky gate, and someone practicing saxophone. Free album. #fieldrecording',
  },
  {
    username: 'ben',
    minutesAgo: 1260,
    content:
      "Current project: a game with no score, no timer, and no way to lose. My brain keeps asking where the tension is. Maybe that's the point. #gamedev",
  },
  {
    username: 'amara',
    minutesAgo: 1440,
    content:
      'I keep a list of meals that took under twenty minutes and still felt like care. Tonight: rice, egg, too much scallion, chili crisp. #food',
  },
  {
    username: 'maya',
    minutesAgo: 1800,
    content:
      "The best feedback I got this week: 'This is clear, but it isn't warm yet.' Going to sit with that one. #design",
  },
  {
    username: 'june',
    minutesAgo: 2040,
    content:
      "A character walked into my draft with a suitcase and no explanation. I've decided to let her stay. #writing",
  },
  {
    username: 'noah',
    minutesAgo: 2280,
    content:
      "There's a bench on the north side of the park with a small brass plaque that just says 'for sitting'. Best design brief I've ever seen.",
  },
  {
    username: 'priya',
    minutesAgo: 2520,
    content:
      "Reminder from lab today: memory loves sleep more than it loves caffeine. I say this as someone holding a third coffee. #neuroscience",
  },
  {
    username: 'theo',
    minutesAgo: 2880,
    content: 'Before and after of the studio. The after is mostly dust, but a tidier kind of dust. #clay #studio',
  },
  {
    username: 'lina',
    minutesAgo: 3120,
    content:
      'Commissions are open for November. Pet portraits, weird houses, imaginary plants — send me your strange ideas. #illustration #commissions',
  },
  {
    username: 'noah',
    minutesAgo: 3600,
    content:
      "Spent an hour people-watching at the laundromat and left with four pages of notes. Public spaces are the best writers' rooms. #writing",
  },
  {
    username: 'priya',
    minutesAgo: 4200,
    content:
      "A tiny thing I've started doing: writing down one question I don't know the answer to before I open my laptop. It makes the day feel more like a conversation.",
  },
];

const comments = [
  { post: 0, username: 'theo', minutesAgo: 12, content: 'The invitation detail is everything.' },
  { post: 0, username: 'june', minutesAgo: 8, content: 'The honest version is usually the better one.' },
  { post: 1, username: 'maya', minutesAgo: 31, content: 'Sending this straight to my focus playlist.' },
  { post: 2, username: 'amara', minutesAgo: 70, content: 'Needed this today.' },
  { post: 2, username: 'lina', minutesAgo: 61, content: 'Closing the book I have been pretending to read.' },
  { post: 3, username: 'lina', minutesAgo: 105, content: 'The crooked one is always the keeper.' },
  { post: 4, username: 'theo', minutesAgo: 150, content: 'The second-guessing is part of the drawing, I think.' },
  { post: 5, username: 'sam', minutesAgo: 200, content: 'I would play this for exactly six minutes.' },
  { post: 7, username: 'lina', minutesAgo: 380, content: 'I make a cup of tea I forget to drink. Very human.' },
  { post: 7, username: 'sam', minutesAgo: 366, content: 'Opening the window for five minutes before I start.' },
  { post: 7, username: 'ben', minutesAgo: 350, content: 'One song on repeat, no skipping.' },
  { post: 7, username: 'priya', minutesAgo: 310, content: 'Writing the first sentence badly on purpose. Lower stakes.' },
  { post: 9, username: 'june', minutesAgo: 620, content: "The hum of the refrigerator and my mother's radio." },
  { post: 10, username: 'maya', minutesAgo: 750, content: 'The scarf is the whole story.' },
  { post: 14, username: 'theo', minutesAgo: 1700, content: 'Warm is the hard part. It always is.' },
  { post: 16, username: 'june', minutesAgo: 2200, content: 'A perfect plaque. A perfect brief.' },
  { post: 17, username: 'ben', minutesAgo: 2400, content: 'Third coffee is where the data gets interesting.' },
];

const follows = [
  ['maya', 'theo'],
  ['maya', 'june'],
  ['maya', 'sam'],
  ['maya', 'lina'],
  ['theo', 'maya'],
  ['theo', 'june'],
  ['theo', 'sam'],
  ['june', 'maya'],
  ['june', 'theo'],
  ['june', 'lina'],
  ['sam', 'maya'],
  ['sam', 'theo'],
  ['sam', 'ben'],
  ['lina', 'maya'],
  ['lina', 'june'],
  ['lina', 'theo'],
  ['lina', 'amara'],
  ['amara', 'maya'],
  ['amara', 'june'],
  ['amara', 'lina'],
  ['ben', 'sam'],
  ['ben', 'lina'],
  ['ben', 'maya'],
  ['noah', 'maya'],
  ['noah', 'june'],
  ['noah', 'priya'],
  ['priya', 'noah'],
  ['priya', 'june'],
];

const likeMap = {
  0: ['theo', 'june', 'sam', 'lina', 'amara'],
  1: ['maya', 'june', 'lina'],
  2: ['maya', 'theo', 'lina', 'amara', 'noah'],
  3: ['maya', 'june', 'sam', 'lina', 'amara', 'priya'],
  4: ['maya', 'theo', 'june'],
  5: ['sam', 'lina', 'noah'],
  6: ['maya', 'june', 'theo', 'lina'],
  7: ['theo', 'june', 'sam', 'lina', 'ben', 'priya'],
  8: ['maya', 'june', 'amara'],
  9: ['maya', 'theo', 'lina', 'noah'],
  10: ['maya', 'june', 'sam'],
  11: ['maya', 'june', 'ben'],
  12: ['sam', 'lina'],
  13: ['maya', 'june', 'lina', 'theo'],
  14: ['theo', 'june', 'lina'],
  15: ['maya', 'theo', 'lina', 'noah'],
  16: ['june', 'maya', 'priya'],
  17: ['noah', 'june'],
  18: ['maya', 'lina', 'june'],
  19: ['maya', 'june', 'lina', 'amara'],
  20: ['june', 'priya'],
  21: ['noah', 'maya', 'june'],
};

function seed({ force = false } = {}) {
  const count = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (count > 0 && !force) return false;

  db.exec('BEGIN');
  try {
    if (force) {
      db.exec(`
        DELETE FROM sessions;
        DELETE FROM comments;
        DELETE FROM likes;
        DELETE FROM follows;
        DELETE FROM posts;
        DELETE FROM users;
        DELETE FROM sqlite_sequence WHERE name IN ('users', 'posts', 'comments');
      `);
    }

    const userIds = new Map();
    const insertUser = db.prepare(`
      INSERT INTO users
        (username, display_name, password_hash, bio, location, website, avatar_color, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const passwordHash = hashPassword(DEMO_PASSWORD);

    for (const user of users) {
      const result = insertUser.run(
        user.username,
        user.displayName,
        passwordHash,
        user.bio,
        user.location,
        user.website,
        user.avatarColor,
        daysAgo(user.joinedDaysAgo),
      );
      userIds.set(user.username, Number(result.lastInsertRowid));
    }

    const postIds = [];
    const insertPost = db.prepare(`
      INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, ?)
    `);

    for (const post of posts) {
      const result = insertPost.run(
        userIds.get(post.username),
        post.content,
        minutesAgo(post.minutesAgo),
      );
      postIds.push(Number(result.lastInsertRowid));
    }

    const insertComment = db.prepare(`
      INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)
    `);

    for (const comment of comments) {
      insertComment.run(
        postIds[comment.post],
        userIds.get(comment.username),
        comment.content,
        minutesAgo(comment.minutesAgo),
      );
    }

    const insertLike = db.prepare(`
      INSERT INTO likes (user_id, post_id, created_at) VALUES (?, ?, ?)
    `);

    for (const [postIndex, usernames] of Object.entries(likeMap)) {
      for (const username of usernames) {
        insertLike.run(
          userIds.get(username),
          postIds[Number(postIndex)],
          minutesAgo(Math.floor(Math.random() * 1000) + 1),
        );
      }
    }

    const insertFollow = db.prepare(`
      INSERT INTO follows (follower_id, following_id, created_at) VALUES (?, ?, ?)
    `);

    for (const [follower, following] of follows) {
      insertFollow.run(
        userIds.get(follower),
        userIds.get(following),
        daysAgo(Math.floor(Math.random() * 100) + 1),
      );
    }

    db.exec('COMMIT');
    return true;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

if (require.main === module) {
  const force = process.argv.includes('--force');
  const seeded = seed({ force });
  console.log(seeded ? 'Seeded the ripple demo data.' : 'Database already has users. Use --force to reseed.');
}

module.exports = { seed, DEMO_PASSWORD };
