export type ValidatorGlobePoint = {
  id: string;
  name: string;
  markerLabel: string;
  address: string;
  description: string;
  projectUrl?: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
  stake: number;
  apy: number;
  commissionRate: number;
  votingPower: number;
  status: "active" | "inactive";
  locationLabel: string;
};
