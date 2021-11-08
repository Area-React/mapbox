import { useEffect } from "react";
import { UseMapbox } from "../hooks/UseMapbox";

const puntoInicial = {
  lng: -74.0734,
  lat: 4.6932,
  zoom: 17.09,
};

export const MapasPage = () => {
  const { setRef, coords, nuevoMarcador$, movimientoMarcador$ } = UseMapbox(puntoInicial);

  useEffect(() => {
    nuevoMarcador$.subscribe((marcador) => {
      console.log(marcador);
    });
  }, [nuevoMarcador$]);

  useEffect(() => {
    movimientoMarcador$.subscribe((marcador) => {
      console.log(marcador.id);
    });
  }, [movimientoMarcador$]);

  return (
    <>
      <div className="info">
        lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div ref={setRef} className="mapContainer" />
    </>
  );
};
