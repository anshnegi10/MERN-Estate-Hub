'use client';

import { extendContext, createElementObject, createPathComponent } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet.markercluster';

function getPropsAndEvents(props: any) {
  let clusterProps: any = {};
  let clusterEvents: any = {};
  const { children, ...rest } = props;
  
  Object.entries(rest).forEach(([propName, prop]) => {
    if (propName.startsWith('on')) {
      clusterEvents[propName] = prop;
    } else {
      clusterProps[propName] = prop;
    }
  });
  
  return { clusterProps, clusterEvents };
}

function createMarkerClusterGroup(props: any, context: any) {
  const { clusterProps, clusterEvents } = getPropsAndEvents(props);
  const markerClusterGroup = new (L as any).MarkerClusterGroup(clusterProps);
  
  Object.entries(clusterEvents).forEach(([eventAsProp, callback]) => {
    const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`;
    markerClusterGroup.on(clusterEvent, callback as any);
  });
  
  return createElementObject(
    markerClusterGroup, 
    extendContext(context, { layerContainer: markerClusterGroup })
  );
}

const updateMarkerCluster = (instance: any, props: any, prevProps: any) => {};

const MarkerClusterGroup = createPathComponent(createMarkerClusterGroup, updateMarkerCluster);

export default MarkerClusterGroup;
