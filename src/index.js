import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);
  const result=[];
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: 5,
  margin: `0 0 5px 0`,
  background: isDragging ? "#555555" : "grey",
  borderRadius:10,
  ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: 5,
  width: 250,
  height: '100px',overflowY: 'scroll',margin: '20px',border: '2px solid blue',borderRadius: '10px',padding: '25px' 
});

const MyComponent = props => {

  const [state, setState] = useState([props.data || [],[]]);

  React.useEffect(() => {
      props?.onChangeChildStates(state);
  }, [state])

  function onDragEnd(result) {
      const { source, destination } = result;
      if (!destination) {
          return;
      }
      
      const sInd = +source.droppableId;
      const dInd = +destination.droppableId;

      if (sInd === dInd) {
          const items = reorder(state[sInd], source.index, destination.index);
          const newState = [...state];
          newState[sInd] = items;
          setState(newState);
      } else {
          const result = move(state[sInd], state[dInd], source, destination);
          const newState = [...state];
          newState[sInd] = result[sInd];
          newState[dInd] = result[dInd];
          setState(newState);
      }
  }

  function moveforward(forward = true){
    const newState = [...state];
    newState[Number(forward)].forEach(e => {
        newState[Number(!forward)].push(e);
    });
    newState[Number(forward)] = [];
    setState(newState);
  }

  return (
    <div>
      <button onClick={() => moveforward(false)}>move all </button>
      <button onClick={() => moveforward(true)}>move all back</button>
      <h1>{props.name}</h1>
      <div style={{ display: "flex" }}>
          <DragDropContext onDragEnd={onDragEnd}>
              {state.map((el, ind) => (
                  <Droppable key={ind} droppableId={`${ind}`}>
                      {(provided, snapshot) => (
                          <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
                              {el.map((item, index) => (
                                  <Draggable key={item.id} draggableId={item.id} index={index} >
                                      {(provided, snapshot) => (
                                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle( snapshot.isDragging,provided.draggableProps.style )} >
                                              <div style={{ display: "flex", justifyContent: "space-around" }} >
                                                  {item.content}
                                              </div>
                                          </div>
                                      )}
                                  </Draggable>
                              ))}
                              {provided.placeholder}
                          </div>
                      )}
                  </Droppable>
              ))}
          </DragDropContext>
      </div>
    </div>
  );
}
export default MyComponent
