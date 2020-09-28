import * as React from 'react'
import { useDispatch } from "react-redux";
import { NotesState } from "./NotesPM";
import { toFilterPM } from "./FilterPM";

type FilterProps = {
  page: NotesState
  nav:any
  navAction:any
}

export type FilterBtnPM = { label: string; v: boolean; ref: string };


export const FilterUI = ({ page, nav , navAction}:FilterProps) => {
  
  const dispatch = useDispatch();
  const filterPM: FilterBtnPM[] = toFilterPM(page.filter);

  var last = filterPM.length - 1;
  return (
    <span className="bubble-filter-bar">
      {filterPM.map((item: FilterBtnPM, i) => (
        <span key={i}>
          <a
            className={item.v ? "bubble-filter-selected" : ""}
            onClick={(e: React.SyntheticEvent) =>
              dispatch(navAction(page, item.ref, nav ))
            }
          >
            {item.label}
          </a>
          {i != last ? " | " : ""}
        </span>
      ))}
    </span>
  );
};
