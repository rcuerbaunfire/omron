baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-map");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);

                baunfire.Animation.headingAnimation(
                    self.find(".main-title .inner-word"),
                    {
                        trigger: self,
                        start: "top 60%",
                    },
                    {
                        onStart: () => {
                            baunfire.Animation.descAnimation(self.find(".para-desc"));
                        },
                    }
                );

                handleMap(self);
            });
        }

        const generateRandomBusinesses = (count = 2000) => {
            const features = [];

            for (let i = 0; i < count; i++) {
                const lon = (Math.random() * 360) - 180;
                const lat = (Math.random() * 170) - 85;
                const name = `Business #${i + 1}`;
                features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [lon, lat]
                    },
                    properties: {
                        title: name
                    }
                });
            }

            return {
                type: 'FeatureCollection',
                features: features
            };
        }

        const handleMap = (self) => {
            const mapContainer = self.find(".map-container");

            const accessToken = 'pk.eyJ1IjoicmN1ZXIiLCJhIjoiY21hbWZpM2c0MGh6djJpb2JueWI0a3hmbyJ9.lqM6AHW-LegevUI4a_weuw';
            const styleURL = mapContainer.data("style");
            const geojsonData = generateRandomBusinesses(500);

            const markers = {};
            const businessMarkers = [];
            const businessMarkerZoom = 4;

            let markersOnScreen = {};

            fetch(styleURL)
                .then(res => res.json())
                .then(style => {
                    const map = new mapboxgl.Map({
                        container: mapContainer.get(0),
                        style,
                        center: [0, 30],
                        zoom: 1.4,
                        accessToken,
                        projection: 'mercator'
                    });

                    map.addControl(new mapboxgl.NavigationControl());

                    map.on('load', () => {
                        // Add a new source from our GeoJSON data and
                        // set the 'cluster' option to true. GL-JS will
                        // add the point_count property to your source data.
                        map.addSource('businesses', {
                            type: 'geojson',
                            // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
                            // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                            data: geojsonData,
                            cluster: true,
                            clusterMaxZoom: 3, // Max zoom to cluster points on
                            clusterRadius: 200, // Radius of each cluster when clustering points (defaults to 50)
                            clusterProperties: {
                                count: ['+', 1] // simple counter for each point
                            }
                        });

                        map.addLayer({
                            id: 'clusters',
                            type: 'circle',
                            source: 'businesses',
                            filter: ['!=', 'cluster', true],
                            paint: {
                                'circle-color': '#6AFF96',
                                'circle-opacity': 1,
                                'circle-radius': 5
                            }
                        });

                        map.on('render', () => {
                            if (!map.isSourceLoaded('businesses')) return;
                            updateMarkers();
                        });

                        addBusinessMarkers();

                        // inspect a cluster on click
                        // map.on('click', 'clusters', (e) => {
                        //     const features = map.queryRenderedFeatures(e.point, {
                        //         layers: ['clusters']
                        //     });
                        //     const clusterId = features[0].properties.cluster_id;
                        //     map.getSource('businesses').getClusterExpansionZoom(
                        //         clusterId,
                        //         (err, zoom) => {
                        //             if (err) return;

                        //             map.easeTo({
                        //                 center: features[0].geometry.coordinates,
                        //                 zoom: zoom
                        //             });
                        //         }
                        //     );
                        // });

                        // map.on('mouseenter', 'clusters', () => {
                        //     map.getCanvas().style.cursor = 'pointer';
                        // });

                        // map.on('mouseleave', 'clusters', () => {
                        //     map.getCanvas().style.cursor = '';
                        // });

                        // map.on('zoom', () => {
                        //     const zoomLevel = map.getZoom();
                        //     console.log('Zooming... Current zoom level:', zoomLevel);
                        // });

                        function updateMarkers() {
                            const newMarkers = {};
                            const features = map.querySourceFeatures('businesses');

                            for (const feature of features) {
                                if (!feature.properties.cluster) continue;

                                const coords = feature.geometry.coordinates;
                                const id = feature.properties.cluster_id;

                                let marker = markers[id];
                                if (!marker) {
                                    const el = document.createElement('div');
                                    el.className = 'map-orb';
                                    el.textContent = feature.properties.point_count_abbreviated;

                                    // 👇 Click to zoom in to cluster
                                    el.addEventListener('click', () => {
                                        map.getSource('businesses').getClusterExpansionZoom(id, (err, zoom) => {
                                            if (err) return;
                                            map.easeTo({
                                                center: coords,
                                                zoom: zoom
                                            });
                                        });
                                    });

                                    marker = markers[id] = new mapboxgl.Marker({ element: el }).setLngLat(coords);
                                }
                                newMarkers[id] = marker;
                                if (!markersOnScreen[id]) marker.addTo(map);
                            }

                            for (const id in markersOnScreen) {
                                if (!newMarkers[id]) markersOnScreen[id].remove();
                            }
                            markersOnScreen = newMarkers;
                        }

                        function addBusinessMarkers() {
                            for (const feature of geojsonData.features) {
                                const el = document.createElement('div');
                                el.className = 'map-label';
                                el.textContent = feature.properties.title;

                                const marker = new mapboxgl.Marker({ element: el, offset: [0, -20] })
                                    .setLngLat(feature.geometry.coordinates);

                                businessMarkers.push(marker);
                            }

                            toggleBusinessMarkers(map.getZoom()); // initial check

                            map.on('zoom', () => {
                                toggleBusinessMarkers(map.getZoom());
                            });
                        }

                        function toggleBusinessMarkers(zoom) {
                            const shouldShow = zoom >= businessMarkerZoom; // adjust this number as needed

                            for (const marker of businessMarkers) {
                                const markerEl = marker.getElement();
                                if (shouldShow) {
                                    if (!markerEl.parentNode) {
                                        marker.addTo(map);
                                    }
                                } else {
                                    if (markerEl.parentNode) {
                                        marker.remove();
                                    }
                                }
                            }
                        }
                    });

                });
        }

        script();
    }
});