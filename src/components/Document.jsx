import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import {
  addMeasure,
  defaultMeasureOptions,
  measuresSelector,
  tracksSelector
} from '../slices/document';

import './Document.scss';

const Document = ({ documentTitle, documentArtist, selectedTrackIndex }) => {
  const dispatch = useDispatch();
  const tracks = useSelector(tracksSelector);
  const measures = useSelector(measuresSelector);

  const handleKeyPress = event => {
    // TODO Can this variable be moved to outermost scope?
    //   Since it's used by renderSelectedTrackNotation too
    const selectedTrack = tracks[selectedTrackIndex];

    switch (event.key) {
      case 'ArrowRight':
        // TODO If the currently focused Measure is NOT last, focus the next column of inputs
        // Otherwise, add a measure to selectedTrack
        dispatch(
          addMeasure({
            trackId: selectedTrack.id,
            id: uuidv4(),
            ...defaultMeasureOptions
          })
        );
        // TODO Add measures to all other tracks too
        break;
      default:
        break;
    }
  };

  // TODO Add support for multitrack view
  const renderSelectedTrackNotation = () => {
    const selectedTrack = tracks[selectedTrackIndex];

    if (tracks.length && measures.length) {
      const measuresInSelectedTrack = selectedTrack.measures.map(measureId =>
        measures.find(someMeasure => someMeasure.id === measureId)
      );

      return (
        <div className="TrackNotation">
          <span className="TrackNotation__TrackName--Abbreviated">
            {selectedTrack.abbreviatedName}
          </span>
          {measuresInSelectedTrack.map((measure, measureNum) => (
            <div className="Measure" key={measureNum}>
              {selectedTrack.tuning.map((stringTuning, stringNum) => (
                <input
                  className="Measure__Input"
                  type="text"
                  value={stringNum}
                  onChange={event => {
                    console.log('you typed a number:', event.target.value);
                  }}
                  onKeyDown={handleKeyPress}
                  key={stringNum}
                />
              ))}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="Document">
      <div className="Document__Page">
        {documentTitle && <h1 className="Document__Title">{documentTitle}</h1>}
        {documentArtist && (
          <h2 className="Document__Artist">{documentArtist}</h2>
        )}
        {renderSelectedTrackNotation()}
      </div>
    </div>
  );
};

export default Document;
