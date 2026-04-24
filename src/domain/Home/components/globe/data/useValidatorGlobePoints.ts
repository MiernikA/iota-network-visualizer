import { useMemo } from "react";
import type { ValidatorSnapshot } from "../../../../../types/validators/ValidatorSnapshot";
import type { ValidatorGlobePoint } from "../../../../../types/globe/ValidatorGlobePoint";

export type { ValidatorGlobePoint } from "../../../../../types/globe/ValidatorGlobePoint";

type ValidatorGeoState = {
  points: ValidatorGlobePoint[];
  isLoading: boolean;
  error: string;
  attempted: number;
};

function hashToGeo(str: string) {
  let hash = 0;
  for (let index = 0; index < str.length; index += 1) {
    hash = str.charCodeAt(index) + ((hash << 5) - hash);
  }

  const lat = (hash % 180) - 90;
  const lng = ((hash / 180) % 360) - 180;

  return { lat, lng };
}

export function useValidatorGlobePoints(
  validators: ValidatorSnapshot[],
  limit = 28,
): ValidatorGeoState {
  const points = useMemo(() => {
    const topValidators = [...validators]
      .sort((left, right) => right.stake - left.stake)
      .slice(0, limit);

    const maxStake = Math.max(
      ...topValidators.map((validator) => validator.stake),
      1,
    );

    return topValidators.map((validator, index) => {
      const hashedGeo = hashToGeo(validator.address);
      const normalizedStake = validator.stake / maxStake;
      const status: "active" | "inactive" =
        validator.stake > 0 ? "active" : "inactive";

      return {
        id: validator.address,
        name: validator.name,
        markerLabel: String(index + 1),
        address: validator.address,
        description: validator.description,
        projectUrl: validator.projectUrl,
        lat: hashedGeo.lat,
        lng: hashedGeo.lng,
        size: 0.22 + normalizedStake * 0.72,
        color:
          status === "active"
            ? `rgba(74, 222, 128, ${0.62 + normalizedStake * 0.28})`
            : `rgba(248, 113, 113, ${0.55 + normalizedStake * 0.2})`,
        stake: validator.stake,
        apy: validator.apy,
        commissionRate: validator.commissionRate,
        votingPower: validator.votingPower,
        status,
        locationLabel: "Hashed location",
      };
    });
  }, [limit, validators]);

  return {
    points,
    isLoading: false,
    error: "",
    attempted: points.length,
  };
}
