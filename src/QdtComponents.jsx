import React from 'react';
import ReactDOM from 'react-dom';
import qApp from './qApp';
import qDoc from './qDoc';
import utility from './utilities/';
import settings from './picasso/settings';
import picassoComponents from './picasso/settings/components';
import picassoInteractions from './picasso/settings/interactions';
import QdtFilter from './components/QdtFilter';
import QdtTable from './components/QdtTable';
import QdtViz from './components/QdtViz';
import QdtSelectionToolbar from './components/QdtSelectionToolbar';
import QdtKpi from './components/QdtKpi';
import QdtButton from './components/QdtButton';
import QdtPicasso from './components/QdtPicasso';
import QdtSearch from './components/QdtSearch';
import QdtCurrentSelections from './components/QdtCurrentSelections';

const components = {
  QdtFilter, QdtTable, QdtViz, QdtSelectionToolbar, QdtKpi, QdtButton, QdtPicasso, QdtSearch, QdtCurrentSelections,
};

function isNumber(n) {
  return !Number.isNaN(parseFloat(n)) && Number.isFinite(parseFloat(n));
}

const QdtComponents = class {
  static picasso = {
    settings,
    components: picassoComponents,
    interactions: picassoInteractions,
  };

  static unmountQdtComponent = element => ReactDOM.unmountComponentAtNode(element)

  constructor(config = {}, connections = { vizApi: true, engineApi: true, useUniqueSessionID: null }) {
    const myConfig = config;
    myConfig.identity = connections.useUniqueSessionID ? connections.useUniqueSessionID : utility.Uid(16);
    this.qAppPromise = (connections.vizApi) ? qApp(myConfig) : null;
    this.qDocPromise = (connections.engineApi) ? qDoc(myConfig) : null;
  }

  render = async (type, props, element) => new Promise((resolve, reject) => {
    try {
      const { qAppPromise, qDocPromise } = this;
      const Component = components[type];
      ReactDOM.render(
        <Component
          {...props}
          qAppPromise={qAppPromise}
          qDocPromise={qDocPromise}
          ref={node => resolve(node)}
        />,
        element,
      );
    //   console.info(version);
    } catch (error) {
      reject(error);
    }
  });

  setSelections = async selection => new Promise(async (resolve, reject) => {
    try {
      const { qAppPromise } = this;
      const qAppp = await qAppPromise;

      const valuesFromLocalStorage = JSON.parse(selection);
      console.log('setSelections valuesFromLocalStorage =', valuesFromLocalStorage);

      if (valuesFromLocalStorage !== null) {
        const locField = valuesFromLocalStorage.field;
        const locSelected = JSON.parse(valuesFromLocalStorage.selected);

        if (locSelected === null) {
          console.log('setSelections field =', locField, 'res array = null');
          qAppp.field(locField).clear();
        } else if (locSelected[0] === 'ALL') {
          console.log('setSelections field =', locField, 'res array = selectAll');
          qAppp.field(locField).selectAll();
        } else if (isNumber(locSelected[0])) {
          let res = [];
          res = locSelected.map(item => parseInt(item, 10));
          console.log('setSelections field =', locField, 'res array Numeric =', JSON.stringify(res));
          qAppp.field(locField).selectValues(res, false, true);
        } else {
          const res = [];
          locSelected.forEach(value => res.push({ qText: value }));
          console.log('setSelections field =', locField, 'res array =', JSON.stringify(res));
          qAppp.field(locField).selectValues(res, false, true);
        }
      } else {
        console.log('setSelections clearAll =', JSON.stringify(valuesFromLocalStorage));
        qAppp.clearAll();
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  })
};

export default QdtComponents;
