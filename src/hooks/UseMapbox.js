import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { v4 } from "uuid";
import {Subject} from "rxjs";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxleGFuZGVybWVuZG9wIiwiYSI6ImNrdmwzY3BzdTMwZzkydW55eXZjYWVycDUifQ.z3HiYp77EC0O6pMiN6zZ9w";

export const UseMapbox = (puntoInicial) => {
  const mapaDiv = useRef();
  const setRef = useCallback((node) => {
    mapaDiv.current = node;
  }, []);

  //Referencia a los marcadores
  const marcadores = useRef({});
  //Mapa
  const mapa = useRef();
  //Coordenadas
  const [coords, setCoords] = useState(puntoInicial);
  //Observables
  const movimientoMarcador = useRef(new Subject());
  const nuevoMarcador = useRef(new Subject());

  const agregarMarcador = useCallback((ev) => {
    
    const { lng, lat } = ev.lngLat;

    const marker = new mapboxgl.Marker();
    marker.id = v4();

    marker
        .setLngLat([lng, lat])
        .addTo(mapa.current)
        .setDraggable(true);
    
    //Asignación de objeto
    marcadores.current[marker.id] = marker;

    //Observables: Si el marcador no tiene id no emitir
    nuevoMarcador.current.next({
        id: marker.id,
        lng,
        lat
    });

   //Escuchar movimientos del marcador
    marker.on('drag', ({target}) => {
        const {id} = target;
        const { lng, lat } = target.getLngLat(); 
        movimientoMarcador.current.next({id, lng, lat});
    })
  }, []);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [puntoInicial.lng, puntoInicial.lat],
      zoom: puntoInicial.zoom,
    });
    mapa.current = map;
  }, [puntoInicial]);

  //Crear un listener en el mapa y obtener la información, cuando se mueva el mapa
  useEffect(() => {
    mapa.current?.on("move", () => {
      const { lng, lat } = mapa.current.getCenter();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapa.current.getZoom().toFixed(2),
      });
    });
  }, []);

  useEffect(() => {
    mapa.current?.on("click", agregarMarcador);
  }, [agregarMarcador]);

  return {
    agregarMarcador,
    coords,
    marcadores,
    movimientoMarcador$: movimientoMarcador.current,
    nuevoMarcador$: nuevoMarcador.current,
    setRef,
  };
};
