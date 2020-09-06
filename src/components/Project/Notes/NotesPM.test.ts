import { toPages, PagePM, filterPM } from "./NotesPM";
import { BubbleNotes, BubbleNote } from "../../../model/domain/BubbleNotes" 

describe("some functionality ", () => {
  it("should test a simple pmodel", () => {
    // ---
    let [n1, n2] = simpleNotes.notes.nodes;
    var pm: PagePM[] = toPages(simpleNotes.notes);
    expect(pm).toEqual([
      { pg: "p1", notes: [n1] },
      { pg: "p2", notes: [n2] },
    ]);

    var filterBlue = (node: BubbleNote) => {
      return node.col == "blue";
    };
    let [p1, p2] = pm;

    var filteredPM = filterPM(pm, filterBlue);  

    expect(filteredPM).toEqual([p2]);
    // -- filter /w groups
    let [g1, g2] = groupNotes.notes.nodes;

    let [g11, g12, g13, g14, g15] = (g1 as any).nodes;
    let [g21, g22] = (g2 as any).nodes;
    var groupPM = toPages(groupNotes.notes);

    expect(groupPM).toEqual([
      { pg: "p1", notes: [g1] },
      { pg: "p3", notes: [g2] },
    ]);

    var yellowOnly = (node: any) => node.col == "yellow";
    var filteredYellow = filterPM(groupPM, yellowOnly);
    
    expect(filteredYellow).toEqual([
      { pg: "p1", notes: [{ $$: "Group", nodes: [g13] }] },
      { pg: "p3", notes: [{ $$: "Group", nodes: [g22] }] },
    ]);


  });
});

const simpleNotes: BubbleNotes = {
  ref: "simple", // <-- reference
  name: "simple",
  notes: {
    $$: "Doc",
    title: "beyond four forces: the evolution of psychotherapy",
    nodes: [
      {
        $$: "Note",
        type: "Excerpt",
        text: "Beyond Four Forces: The Evolution of   Psychotherapy",
        pg: 1,
        col: "white",
        did: "5c1b584b0f1297239956f5813533e5c1",
      },
      {
        $$: "Note",
        type: "Excerpt",
        text: "Colette Fleuridas1 and Drew Krafcik2",
        pg: 2,
        col: "blue",
        did: "7301ae81b05cf15f0a18a159c6c4c553",
      },
    ],
  },
};

const groupNotes: BubbleNotes = {
  ref: "goups",
  name: "groups",
  notes: {
    $$: "Doc",
    title: "beyond four forces: the evolution of psychotherapy",
    nodes: [
      {
        $$: "Group",
        nodes: [
          {
            $$: "Note",
            type: "Excerpt",
            text: "A text notes here",
            col: "pink",
            did: "857443c8825928ad86db82a321ea9723",
          },
          {
            $$: "Note",
            type: "Excerpt",
            text: "Colette Fleuridas1 and Drew Krafcik2",
            pg: 1,
            col: "red",
            did: "6945fd780184374f1c08792d299ee063",
          },
          {
            $$: "Note",
            type: "Excerpt",
            text:
              "which one views the evolution of psycho-  therapy is shaped by historical, sociopolitical, philosophical,   and cultural worldviews and movements, as well as by rele-  vant scientific discoveries, global dev",
            pg: 1,
            col: "yellow",
            did: "00381ba4ead51b025c63bb384b6e3990",
          },
          {
            $$: "Note",
            type: "Excerpt",
            text:
              "paradigms that shape the field. The first three of   these forces are commonly presented as psychoanalytic,   behavioral, and humanistic-existential (e.g., Friedlander,   Pieterse, & Lambert, 2012; Ma",
            pg: 1,
            col: "green",
            did: "8a2f31021c91ed070b5c8798a28babdb",
          },
          {
            $$: "Note",
            type: "Excerpt",
            text: "field when scholars con",
            pg: 1,
            col: "blue",
            did: "76adbb580807252b8bc05139f116021f",
          },
        ],
      },
      {
        $$: "Group",
        nodes: [
          {
            $$: "Note",
            type: "Comment",
            text: "A comment",
            col: "green",
            did: "607f3452b14bd4f8db932522ee9d565f",
          },
          {
            $$: "Note",
            type: "Excerpt",
            text: "Textbox #2\nHere is the\nText bix",
            pg: 3,
            col: "yellow",
            did: "6e6f38c344d9eebbef7706bef26b8cb8",
          },
        ],
      },
    ],
  },
};
