CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO blogs (author, url, title, likes, user_id, created_at, updated_at) VALUES ('Michael Chan', 'https://reactpatterns.com/', 'React patterns', 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO blogs (author, url, title, likes, user_id, created_at, updated_at) VALUES ('Edsger W. Dijkstra', 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', 'Go To Statement Considered Harmful', 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO blogs (author, url, title, likes, user_id, created_at, updated_at) VALUES ('Edsger W. Dijkstra', 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', 'Canonical string reduction', 12, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO blogs (author, url, title, likes, user_id, created_at, updated_at) VALUES ('Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html', 'First class tests', 10, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO blogs (author, url, title, likes, user_id, created_at, updated_at) VALUES ('Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', 'TDD harms architecture', 5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO blogs (author, url, title, likes, user_id, created_at, updated_at) VALUES ('Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', 'Type wars', 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, name) VALUES
    ('john_doe', 'John Doe'),
    ('jane_smith', 'Jane Smith'),
    ('alex_brown', 'Alex Brown');