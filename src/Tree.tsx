import React, { useState } from 'react';
import styled from 'styled-components';

type ListItem = {
  id: string;
  name: string;
  children: ListItem[];
};

const ListItemContainer = styled.div<{ isRoot?: boolean }>`
  display: flex;
  flex-direction: column;
  padding-left: ${(props) => (props.isRoot ? '0px' : '20px')};
  margin: 5px 0;
`;

const Button = styled.button`
  margin-left: 10px;
`;

const InputContainer = styled.div`
  margin-top: 10px;
`;

const Tree = () => {
  const [list, setList] = useState<ListItem>({
    id: 'root',
    name: 'Main Parent',
    children: [],
  });

  const [selectedId, setSelectedId] = useState<string | null>('root'); 
  const [newItemName, setNewItemName] = useState<string>('');

  const handleAddChild = () => {
    if (!newItemName.trim()) return;

    const addItem = (items: ListItem[]): ListItem[] => {
      return items.map((item) => {
        if (item.id === selectedId) {
          return {
            ...item,
            children: [
              ...item.children,
              { id: Date.now().toString(), name: newItemName, children: [] },
            ],
          };
        }
        return {
          ...item,
          children: addItem(item.children),
        };
      });
    };

    if (selectedId === 'root') {
      setList({
        ...list,
        children: [
          ...list.children,
          { id: Date.now().toString(), name: newItemName, children: [] },
        ],
      });
    } else {
      setList({
        ...list,
        children: addItem(list.children),
      });
    }
    setNewItemName('');
  };

  const handleDelete = (itemId: string) => {
    const deleteItem = (items: ListItem[]): ListItem[] => {
      return items.filter((item) => item.id !== itemId).map((item) => ({
        ...item,
        children: deleteItem(item.children),
      }));
    };

    if (list.id !== itemId) {
      setList({
        ...list,
        children: deleteItem(list.children),
      });
    }
  };

  const renderList = (item: ListItem, isRoot = false) => (
    <ListItemContainer key={item.id} isRoot={isRoot}>
      <div>
        <span onClick={() => setSelectedId(item.id)}>{item.name}</span>
        {!isRoot && <Button onClick={() => handleDelete(item.id)}>Delete</Button>}
      </div>
      {item.children.length > 0 && item.children.map((child) => renderList(child))}
    </ListItemContainer>
  );

  return (
    <div>
      {renderList(list, true)}
      <InputContainer>
        <input
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="New item name"
        />
        <Button onClick={handleAddChild}>Add Child</Button>
      </InputContainer>
    </div>
  );
};

export default Tree;
