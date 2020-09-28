import { BubbleNotes, NotesFilter } from './../../../model/domain/BubbleNotes';
import { PageState } from './../../../model/resource/PageResource';
import { BubbleDoc, BubbleNoteOrGroup, BubbleNote } from '../../../model/domain/BubbleNotes';
import { SECTION } from './filter';

export type NotesState = PageState<BubbleNotes, NotesFilter>;

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

  // --  HACK ... section is dynamically calculated, should be done as a pmodel layer
  var currentSection:any = null
  var node0:BubbleNoteOrGroup
  for (node0 of doc.nodes as any) {
  
    if ((node0 as any).col == SECTION) {
      currentSection = (node0 as any).did;
    }
    if (node0.$$ == "Group") {
      for (var childNode of node0.nodes) {
        childNode.section = currentSection
      }
    }
    
    node0.section = currentSection
  }




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
