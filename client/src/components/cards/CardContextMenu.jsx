import React from 'react';
import styled from 'styled-components';

const CardContextMenu = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <ul className="list">
          <li className="element">
            {/* Edit (Pencil) */}
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            <p className="label">Edit</p>
          </li>
          <li className="element delete">
            {/* Delete (Trash) */}
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            </svg>
            <p className="label">Delete</p>
          </li>
          <li className="element">
            {/* Save (Floppy Disk) */}
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8 15 3" />
            </svg>
            <p className="label">Save</p>
          </li>
        </ul>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 200px;
    background: #fff;
    border-radius: 10px;
    padding: 18px 0;
    box-shadow: 0 2px 9px rgba(30,30,30,0.07);
  }

  .list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 16px;
    margin: 0;
  }

  .element {
    display: flex;
    align-items: center;
    color: #000;
    gap: 15px;
    padding: 7px 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .element svg {
    width: 20px;
    height: 20px;
    stroke: #000;
    transition: stroke 0.2s;
  }

  .element:hover,
  .element:active {
    background: #000;
    color: #fff;
  }

  .element:hover svg,
  .element:active svg {
    stroke: #fff;
  }

  .label {
    font-weight: 600;
  }
`;

export default CardContextMenu;
