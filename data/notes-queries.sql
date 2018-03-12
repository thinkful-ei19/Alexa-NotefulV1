-- SELECT * FROM notes;

-- SELECT * FROM notes LIMIT 5;

-- SELECT * FROM notes ORDER BY id ASC;
-- SELECT * FROM notes ORDER BY title ASC LIMIT 5;
-- SELECT * FROM notes ORDER BY created DESC LIMIT 3;

-- SELECT id, title FROM notes
-- WHERE title = 'What the government doesn''t want you to know about cats';

-- SELECT * FROM notes
-- WHERE title = '7 things lady gaga has in common with cats';

-- SELECT id, title FROM notes
-- WHERE title LIKE '%boring%';

-- SELECT id, title FROM notes
-- WHERE title LIKE '%10 ways cats can%';

-- UPDATE notes
-- SET title = 'Updated new note'
-- WHERE title = 'Why you should forget everything you learned about cats';

-- checked to see if my note updated 
-- SELECT * FROM notes
-- WHERE id = 1009;

-- INSERT INTO notes
-- (id, title, content) VALUES
-- (1010, 'Creating a new note', 'TESTING!');

-- INSERT INTO notes
-- (id, title, content) VALUES
-- (1011, 'New note title', 'New note content');

-- DELETE FROM notes
-- WHERE id = 1011;

-- DELETE FROM notes
-- WHERE id = 1010;


-- SELECT * FROM notes
-- WHERE id = 1010;
