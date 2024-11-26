import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useMapStore from "../store/useMapStore";

export const useUrlSync = () => {
  const navigate = useNavigate();
  const { selectedRegion, selectedDataset, selectedDate } = useMapStore();

  useEffect(() => {
    if (!selectedRegion) {
      navigate("/", { replace: true });
      return;
    }

    if (!selectedDataset) {
      navigate(`/${selectedRegion.id}`, { replace: true });
      return;
    }

    if (!selectedDate) {
      navigate(`/${selectedRegion.id}/${selectedDataset.id}`, { replace: true });
      return;
    }

    navigate(
      `/${selectedRegion.id}/${selectedDataset.id}/${selectedDate}`, 
      { replace: true }
    );
  }, [selectedRegion, selectedDataset, selectedDate, navigate]);
};
