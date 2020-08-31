import { BubbleDoc, BubbleNoteOrGroup, BubbleNote } from '../../../model/domain /BubbleNotes';


/**
 * presentation model for the bubble does
 *
 */

export type PagePM = {
  pg: string;
  notes: BubbleNoteOrGroup[];
};

export const toPages = (doc: BubbleDoc): PagePM[] => {
  var out: PagePM[] = [];
  var pg: number = -1; // <-- recall: page from pdf is always a non-negative integer
  var node: BubbleNoteOrGroup;
  var pNodes: BubbleNoteOrGroup[] = [];
  var nextPg: number;
  for (node of doc.nodes as any) {
    var nextPg = getNextPage(node, doc.nodes);
    ({ pNodes, out, pg } = updatePageGroup(out, pNodes, pg, nextPg));
    pNodes.push(node);
  }

  if (pNodes.length > 0) {
    out.push(toPM(pg, pNodes));
  }

  return out;
};

/**
 * Retruns the page from the nodes, or if it has no node, the next node /w a page
 */
const getNextPage = (node0: BubbleNoteOrGroup, nodes: any[]): number => {
  var index0 = nodes.indexOf(node0);
  for (var i = index0; i < nodes.length; i++) {
    var node = nodes[i] as BubbleNoteOrGroup;

    if (node.$$ == "Group") {
      var groupPg: number = getNextPage(node.nodes[0], node.nodes);
      if (groupPg >= 1) {
        return groupPg;
      }
    } else if (node.pg) {
      return node.pg;
    }
  }
  return -1;
};

const updatePageGroup = (out: any[], pNodes: any[], pg: any, newPg: any) => {
  if (pg != newPg && newPg > 0) {
    if (pNodes.length > 0) {
      out.push(toPM(pg, pNodes));
    }
    pg = newPg;
    pNodes = [];
  }
  return { pNodes, out, pg };
};

const toPM = (pg: number, notes: BubbleNoteOrGroup[]) => ({
  pg: `p${pg}`,
  notes,
});

// -- filter functionality

export const filterPM = (
  pages: PagePM[],
  fn: (page: BubbleNote) => boolean
): PagePM[] => {
  var filtered = pages.map((page: PagePM) => {
    var notes = page.notes
      .map((node) => {
        if (node.$$ == "Group") {
          var nodes = node.nodes.filter(fn);
          return nodes.length > 0 ? { $$: "Group", nodes } : null;
        } else {
          return fn(node) ? node : null;
        }
      })
      .filter(notNull);

    return notes.length > 0 ? { ...page, notes } : null;
  });
  var out = filtered.filter(notNull) as any;
  return out;
};

const notNull = (v: any) => v != null;

const NOTE_TYPES = {
  Excerpt: true,
  Comment: true,
  Hilight: true,
}; // Comment, probably group etc
const COLOURS = {
  FFFFFF: "white",
  "99B5FF": "blue",
  FFEA99: "yellow",
  FF99FF: "pink",
  FF9E99: "red",
  "00A595": "green",
  "000000": "clear",
};
