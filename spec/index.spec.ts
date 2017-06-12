import { IFileInformation, SearchIndex } from "../ts/index";
import * as File from "vinyl";
import * as lunr from "lunr";

describe("SearchIndex: test add", () => {
    it("tests that an added item is in the resulting index", () => {
        let meta: IFileInformation[] = [{
            "body": "Hello World!",
            "description": "test",
            "keywords": "a, b, c",
            "href": "filename",
            "title": "Hello"
        }];
        let result = SearchIndex.createFromInfo(meta);

        expect(result.store).toEqual({ filename: { description: "test", title: "Hello" }});
        expect(result.index).toBeDefined();

        let lnr = lunr.Index.load(JSON.parse(JSON.stringify(result.index)));
        let r: lunr.IIndexSearchResult[] = lnr.search("World*");
        expect(r.length).toBe(1);
        expect(r[0].ref).toBe("filename");
        expect(result.store[r[0].ref].title).toBe("Hello");
    });

    it("tests that an added file is in the resulting index", () => {
        let files: File[] = [new File({
            cwd: '/',
            base: '/test/',
            path: '/test/filename.js',
            contents: new Buffer(htmlFile)
        })];
        let result = SearchIndex.createFromHtml(files);

        expect(result.store).toEqual({ filename: { description: "test", title: "Hello" }});
        expect(result.index).toBeDefined();

        let lnr = lunr.Index.load(JSON.parse(JSON.stringify(result.index)));
        let r: lunr.IIndexSearchResult[] = lnr.search("World*");
        expect(r.length).toBe(1);
        expect(r[0].ref).toBe("filename");
        expect(result.store[r[0].ref].title).toBe("Hello");
    });
});

let htmlFile: string = `
<html>
  <head>
    <title>Hello</title>
    <meta name="description" content="test" />
    <meta name="keywords" content="a, b, c" />
  </head>
  <body>
    Hello World!
  </body>
</html>
`;