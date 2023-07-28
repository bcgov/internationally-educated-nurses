import { BadRequestException, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

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

  async getData(url: string, header = {}) {
    return this.api_instance
      .get(`${url}`, { headers: header })
      .then((response: AxiosResponse) => {
        if (response.status !== 200) throw new BadRequestException(response);
        return response.data;
      })
      .catch(e => {
        throw new BadRequestException(e.response);
      });
  }

  async getHa() {
    return this.getData(`/health-authorities`);
  }

  async getStaff() {
    const header = {
      ApiKey: process.env.HMBC_ATS_AUTH_KEY,
    };
    return this.getData(`/staff`, header);
  }

  async getReason() {
    return this.getData(`/withdrawal-reasons`);
  }

  async getDepartment() {
    return this.getData(`/specialty-departments`);
  }

  async getMilestone() {
    return this.getData(`/milestones`);
  }

  async getApplicants(url: string) {
    const header = {
      ApiKey: process.env.HMBC_ATS_AUTH_KEY,
    };
    return this.getData(url, header);
  }
}
