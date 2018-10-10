const component = function component({
  key = 'bar',
  displayOrder = 1,
  field = 'qDimensionInfo/0',
  collection = null, // For Stacked bar chart
  orientation = 'vertical',
  fill = '#4477AA',
  strokeWidth = 1,
  stroke = '#D2D2D2',
  start = 0,
  end = { field: 'qMeasureInfo/0' },
} = {}) {
  const comp = {
    type: 'box',
    key,
    displayOrder,
    data: {
      extract: {
        field,
        props: {
          start,
          end,
        },
      },
    },
    settings: {
      major: { scale: (orientation === 'vertical') ? 'x' : 'y' },
      minor: { scale: (orientation === 'vertical') ? 'y' : 'x' },
      orientation,
      box: {
        fill,
        strokeWidth,
        stroke,
      },
    },
    brush: {
      trigger: [{
        on: 'tap',
        contexts: ['select'],
      }],
      consume: [{
        context: 'select',
        style: {
          active: {
            opacity: 1,
          },
          inactive: {
            opacity: 0.5,
          },
        },
      }],
    },
  };

  // If we initiate connection in the schema, we get errors
  if (collection) {
    comp.data = { collection };
    comp.minor = { scale: 'y', ref: 'end' };
  }
  return comp;
};

export default component;
