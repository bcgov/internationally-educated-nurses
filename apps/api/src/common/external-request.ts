// import { LoggerService } from '@nestjs/common';
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
      timeout: 15000,
    });
  }

  async getData(url: string) {
    return await this.api_instance
      .get(`${url}`)
      .then((response: AxiosResponse) => {
        if (response.status !== 200)
            throw new BadRequestException(response);
        return response.data;
      })
      .catch(e => {
        throw new BadRequestException(e.response);
      });
  }

  async getHa() {
    return await this.getData(`/HealthAuthority`);
  }

  async getStaff() {
    return await this.getData(`/staff`)
  }

  async getReason() {
    return await this.getData(`/Reason`)
  }
}
