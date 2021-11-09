import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { UseMapbox } from "../hooks/UseMapbox";

const puntoInicial = {
  lng: -74.0734,
  lat: 4.6932,
  zoom: 17.09,
};

export const MapasPage = () => {
  const {
    setRef,
    coords,
    nuevoMarcador$,
    movimientoMarcador$,
    agregarMarcador,
    actualizarPosicion,
  } = UseMapbox(puntoInicial);
  const { socket } = useContext(SocketContext);

  //Escuchar los marcadores existentes
  useEffect(() => {
    socket.on("marcadores-activos", (marcador) => {
      for (const key of Object.keys(marcador)) {
        agregarMarcador(marcador[key], key);
      }
    });
  }, [socket, agregarMarcador]);

  //Marcador Nuevo
  useEffect(() => {
    nuevoMarcador$.subscribe((marcador) => {
      // console.log(marcador);
      socket.emit("marcador-nuevo", marcador);
    });
  }, [nuevoMarcador$, socket]);

  //Movimiento de marcador
  useEffect(() => {
    movimientoMarcador$.subscribe((marcador) => {
      // console.log(marcador.id);
      socket.emit("marcador-actualizado", marcador);
    });
  }, [movimientoMarcador$, socket]);

  //Mover marcador mediante sockets
  useEffect(() => {
    socket.on("marcador-actualizado", (marcador) => {
      actualizarPosicion(marcador);
    });
  }, [socket, actualizarPosicion]);

  //Escuchar nuevos marcadores
  useEffect(() => {
    socket.on("marcador-nuevo", (marcador) => {
      agregarMarcador(marcador, marcador.id);
    });
  }, [socket, agregarMarcador]);

  return (
    <>
      <div className="info">
        lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div ref={setRef} className="mapContainer" />
    </>
  );
};
