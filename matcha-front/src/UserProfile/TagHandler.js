import React, { useState, useEffect } from "react";
import { WithContext as ReactTags } from 'react-tag-input';

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "../style.css";
import "./UserProfile.css";

export default function TagHandler(props) {

  const [tags, setTags] = React.useState([
    { id: 'python', text: 'python' },
    { id: 'javascript', text: 'javascript' },
    { id: 'c++', text: 'c++' },
    { id: 'malloc', text: 'malloc' }
  ]);

  const suggestions = [
    {id: 'php', text: 'php'},
    {id: 'hey', text: 'hey'},
    {id: 'hello', text: 'hello'},
    {id: 'coucou', text: 'coucou'},
    {id: 'tag2123', text: 'tag2123'},
    {id: 'gourdin', text: 'gourdin'},
    {id: 'tag4', text: 'tag4'},
    {id: 'tag5', text: 'tag5'},
    {id: 'tag6', text: 'tag6'},
    {id: 'tag7', text: 'tag7'},
  ];

  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = tag => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = index => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  return (
    <div className="react-tag-custom">
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          inputFieldPosition="bottom"
          autocomplete
        />
    </div>
  );
}
