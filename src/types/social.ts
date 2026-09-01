export interface SocialVisitLogDTO {
  id: number;
  vehicleId: number;
  vehicleName: string;
  dealerId: number;
  dealerName: string;
  source: string;
  postId: string | null;
  postUrl: string | null;
  visitedAt: string;
}
export interface RecordSocialVisitRequest {
  vehicleId: number;
  source: string;
}
