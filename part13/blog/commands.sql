CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    createdDate TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO blogs (author, url, title, likes) VALUES ('Michael Chan', 'https://reactpatterns.com/', 'React patterns', 7);
INSERT INTO blogs (author, url, title, likes) VALUES ('Edsger W. Dijkstra', 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', 'Go To Statement Considered Harmful', 5);
INSERT INTO blogs (author, url, title, likes) VALUES ('Edsger W. Dijkstra', 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', 'Canonical string reduction', 12);
INSERT INTO blogs (author, url, title, likes) VALUES ('Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html', 'First class tests', 10);
INSERT INTO blogs (author, url, title, likes) VALUES ('Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', 'TDD harms architecture', 0);
INSERT INTO blogs (author, url, title, likes) VALUES ('Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', 'Type wars', 2);