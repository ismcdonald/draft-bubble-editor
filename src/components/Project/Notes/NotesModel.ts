export type BubbleNotes = {
  ref: string;
  name: string;
  notes: BubbleDoc;
};
export type BubbleDoc = {
  $$: "Doc";
  title: string;
  nodes: BubbleNoteOrGroup[];
};

export type BubbleNote = {
  $$: "Note";
  col: string;
  did: string;
  ref?: BubbleRef;
  text: string;
  type: string;
};

export type BubbleNoteOrGroup =
  | BubbleNote
  | {
      $$: "Group";
      nodes: BubbleNote[];
    };

export type BubbleRef = {
  doc: string;
  pg: number;
};
