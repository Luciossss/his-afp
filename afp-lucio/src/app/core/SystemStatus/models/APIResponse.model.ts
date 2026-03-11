import { HealthStatus } from "../HealtStatus.model";

export interface APIResponse<T> {
  status: string;
  data: T;
}
