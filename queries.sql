CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	title VARCHAR(100),
	author VARCHAR(45),
	date_read DATE,
	rating VARCHAR(50),
	ISBN INT,
	review TEXT,
	amazon_link TEXT
);

CREATE TABLE notes (
	id SERIAL PRIMARY KEY,
	note TEXT,
	book_id INTEGER REFERENCES books(id)
);

-- Testing code
INSERT INTO books (title, author, date_read, rating, ISBN, review, amazon_link)
VALUES (
    'You Can Negotiate Anything',
    'Herb Cohen',
    '2023-08-02',
    '10/10',
    0806541229,
    'Everything is negotiable. Challenge authority. You have the power in any situation. This is how to realize it and use it. A must-read classic from 1980 from a master negotiator. My notes here aren''t enough because the little book is filled with so many memorable stories — examples of great day-to-day moments of negotiation that will stick in your head for when you need them. (I especially loved the one about the power of the prisoner in solitary confinement.) So go buy and read the book. I''m giving it a 10/10 rating even though the second half of the book loses steam, because the first half is so crucial.',
    'https://www.amazon.com/s?k=you+can+negotiate+anything+book&hvadid=694984119018&hvdev=c&hvlocphy=9007964&hvnetw=g&hvqmt=e&hvrand=2878219015828636347&hvtargid=kwd-304960667654&hydadcr=22135_13541118&tag=googhydr-20&ref=pd_sl_8uosogy7le_e'
);

INSERT INTO notes (note, book_id) VALUES (
    'Quantum entanglement is a phenomenon where two particles become interconnected, and the quantum state of each particle cannot be described independently, even when separated by a large distance. This "spooky action at a distance" as Einstein called it, challenges our understanding of local realism.',
    1
);

INSERT INTO notes (note, book_id) VALUES (
    'The theory of general relativity posits that massive objects warp the fabric of spacetime, causing what we perceive as gravity. This concept can be visualized as a heavy ball on a stretched rubber sheet, with smaller objects following curved paths around it.',
    1
);