import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class FeatureFlagService {
  private readonly logger = new Logger(FeatureFlagService.name);
  private readonly ssm = new AWS.SSM();

  private static readonly FEATURE_FLAG_PREFIX = `/ien/${process.env.TARGET_ENV}/feature_flags`;

  // we can extend here for future feature flags
  static readonly FeatureFlags = {
    CAN_HA_ACCESS_REPORT: `${FeatureFlagService.FEATURE_FLAG_PREFIX}/can_ha_access_report`,
  };

  /**
   * Retrieves the feature flag value from AWS SSM Parameter Store.
   * @param {string} featureFlag - The feature flag name in SSM.
   * @returns {Promise<boolean>} - Returns true if the feature flag is enabled, false otherwise.
   */
  async getFeatureFlag(featureFlag: string): Promise<boolean> {
    // If in local environment, return true
    if (process.env.NODE_ENV !== 'production') {
      this.logger.log(`LOCAL: Feature flag ${featureFlag} is set to: true`);
      return true;
    }

    try {
      const params = {
        Name: featureFlag, // Use the feature flag name directly
        WithDecryption: false, // We don't need decryption for plain text values
      };

      // Fetch the parameter from SSM
      const result = await this.ssm.getParameter(params).promise();

      // Convert the string "true"/"false" to a boolean value
      const flagValue = result.Parameter?.Value === 'true';
      this.logger.log(`Feature flag ${featureFlag} is set to: ${flagValue}`);
      return flagValue;
    } catch (error: unknown) {
      this.logger.error(`Error fetching feature flag from SSM: ${(error as Error)?.message}`);
      return false; // Default to false if there's an error
    }
  }
}
