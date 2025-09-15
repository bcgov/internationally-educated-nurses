import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { AtsApplicant, AtsMilestone } from '@ien/common';

@Injectable()
export class ExternalRequest {
  private baseurl: string;
  private api_instance;
  constructor() {
    this.baseurl = process.env.HMBC_ATS_BASE_URL || `https://ien.heabc.bc.ca`;
    this.api_instance = axios.create({
      baseURL: this.baseurl,
      timeout: 50000,
    });
  }

  async getData<T>(url: string, header = {}) {
    return this.api_instance.get<T>(`${url}`, { headers: header }).then(response => {
      if (response.status !== 200) throw new BadRequestException(response);
      return response.data;
    });
  }

  async getHa(): Promise<Array<{ id: string; name: string; abbreviation: string }>> {
    return this.getData(`/health-authorities`);
  }

  async getStaff(): Promise<Array<{ id: string; name: string; email: string }>> {
    const header = {
      ApiKey: process.env.HMBC_ATS_AUTH_KEY,
    };
    return this.getData(`/staff`, header);
  }

  async getReason(): Promise<Array<unknown>> {
    return this.getData(`/withdrawal-reasons`);
  }

  /**
   * @deprecated
   */
  async getDepartment() {
    return this.getData(`/specialty-departments`);
  }

  async getMilestone() {
    return this.getData<AtsMilestone[]>(`/milestones`);
  }

  async getApplicants(url: string) {
    const header = {
      ApiKey: process.env.HMBC_ATS_AUTH_KEY,
    };
    return this.getData<AtsApplicant[]>(url, header);
  }
}
