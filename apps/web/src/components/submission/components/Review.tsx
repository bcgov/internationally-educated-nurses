import { Checkbox, Error, FormStepHeader, Link, Notice, Alert } from '@components';
import {
  booleanToYesNo,
  EmploymentTypes,
  SpecialtyDTO,
  Lha,
  rebuildHaStructure,
} from '@ehpr/common';

import { useFormikContext } from 'formik';
import {
  employmentCircumstanceOptions,
  employmentOptions,
  getOptionLabelByValue,
  getSpecialtyLabelById,
  getStreamLabelById,
  getSubspecialtyLabelById,
  healthAuthorityOptions,
  registrationStatusOptions,
  SubmissionType,
} from '../validation';
import {
  deploymentDurationOptions,
  placementOptions as allPlacementOptions,
  deploymentTypeOptions,
} from '../validation/preferences';

export const Review: React.FC = () => {
  const { values } = useFormikContext<SubmissionType>();
  const { personalInformation, contactInformation, credentialInformation, preferencesInformation } =
    values;
  const { firstName, lastName, postalCode } = personalInformation;
  const { primaryPhone, primaryPhoneExt, secondaryPhone, secondaryPhoneExt, email } =
    contactInformation;
  const {
    stream,
    specialties,
    registrationStatus,
    registrationNumber,
    currentEmployment,
    employmentCircumstance,
    healthAuthorities,
    nonClinicalJobTitle,
  } = credentialInformation;
  const {
    deployAnywhere,
    deploymentLocations,
    placementOptions,
    hasImmunizationTraining,
    deploymentDuration,
    deploymentType,
  } = preferencesInformation;

  if (!stream) {
    return null;
  }

  return (
    <>
      <FormStepHeader>5. Review and Submit</FormStepHeader>
      <div className='grid grid-cols-1 divide-y divide-gray-400 -my-7'>
        <ReviewSection sectionHeader='Primary Information' step={1} columns={3}>
          <ReviewItem label='First Name' value={firstName} />
          <ReviewItem label='Last Name' value={lastName} />
          <ReviewItem label='Postal Code' value={postalCode} />
        </ReviewSection>

        <ReviewSection sectionHeader='Contact Information' step={2} columns={2}>
          <ReviewItem
            label='Primary Phone Number'
            value={phoneNumberWithExtension(primaryPhone, primaryPhoneExt)}
          />
          {secondaryPhone ? (
            <ReviewItem
              label='Secondary Phone Number'
              value={phoneNumberWithExtension(secondaryPhone, secondaryPhoneExt)}
            />
          ) : null}
          <ReviewItem label='Email Address' value={email} />
        </ReviewSection>

        <ReviewSection sectionHeader='Credentials Information' step={3} columns={1}>
          <ReviewItem label='Stream Type' value={getStreamLabelById(stream)} />
          {nonClinicalJobTitle ? (
            <ReviewItem label='Provide your job title' value={nonClinicalJobTitle} />
          ) : null}
          {specialties.map((specialty: SpecialtyDTO) => (
            <ReviewSpecialty key={specialty.id} specialty={specialty} />
          ))}
          <ReviewItem
            label='Select which best applies to your current registration status'
            value={getOptionLabelByValue(registrationStatusOptions, registrationStatus)}
          />
          {registrationNumber ? (
            <ReviewItem
              label='Indicate your registration number from your credentialing body'
              value={registrationNumber}
            />
          ) : null}
          <ReviewItem
            label='Select which best applies to your current employment status'
            value={getOptionLabelByValue(employmentOptions, currentEmployment)}
          />
          {currentEmployment === EmploymentTypes.HEALTH_SECTOR_EMPLOYED ? (
            <ReviewItemList
              label='Indicate where you are employed (select all that apply)'
              values={healthAuthorities?.map(healthAuthority =>
                getOptionLabelByValue(healthAuthorityOptions, healthAuthority),
              )}
            />
          ) : null}
          {currentEmployment === EmploymentTypes.HEALTH_SECTORY_RESIDENCY ? (
            <ReviewItemList
              label='Indicate where you are doing your practicum/residency (select all that apply)'
              values={healthAuthorities?.map(healthAuthority =>
                getOptionLabelByValue(healthAuthorityOptions, healthAuthority),
              )}
            />
          ) : null}
          {currentEmployment === EmploymentTypes.NOT_HEALTH_SECTOR_EMPLOYED &&
          employmentCircumstance ? (
            <ReviewItem
              label='Select your circumstance'
              value={getOptionLabelByValue(employmentCircumstanceOptions, employmentCircumstance)}
            />
          ) : null}
        </ReviewSection>
        <ReviewSection sectionHeader='Employment Preferences' step={4} columns={1}>
          <ReviewItem
            label='Are you willing to deploy anywhere in BC?'
            value={booleanToYesNo(deployAnywhere)}
          />

          {deploymentLocations?.length > 0 ? (
            <ReviewDeploymentHsda lhas={deploymentLocations} />
          ) : null}

          <ReviewItemList
            label='Indicate the placement option(s) you are willing to support'
            values={placementOptions?.map(placementOption =>
              getOptionLabelByValue(allPlacementOptions, placementOption),
            )}
          />
          <ReviewItem
            label='Have you received immunization training in the past five years?'
            value={booleanToYesNo(hasImmunizationTraining)}
          />
          <ReviewItem
            label='Indicate the maximum duration of deployment you are willing to support'
            value={getOptionLabelByValue(deploymentDurationOptions, deploymentDuration)}
          />
          <ReviewItemList
            label='Indicate the type of deployment you are willing to support'
            values={deploymentType.map(deployment =>
              getOptionLabelByValue(deploymentTypeOptions, deployment),
            )}
          />
        </ReviewSection>

        <div className='py-7'>
          <Notice>
            <Checkbox
              label={`By checking the box, I certify that I am the person named on this form and all information is true and complete to the best of my knowledge.`}
              name='confirm'
            />
          </Notice>
          <Error name='confirm' />
          <Alert>Please print and save this page for your own records.</Alert>
        </div>
      </div>
    </>
  );
};

const phoneNumberWithExtension = (phoneNumber: string, extension?: string) => {
  if (extension) {
    return phoneNumber + ' | ' + extension;
  }
  return phoneNumber;
};

interface ReviewSectionProps {
  sectionHeader: string;
  step: number;
  columns: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  sectionHeader,
  step,
  columns,
  children,
}) => {
  return (
    <div className='py-7'>
      <div className='flex items-center gap-4 mb-3'>
        <h2 className='text-bcBluePrimary text-xl'>{sectionHeader}</h2>
        <Link href={`/submission/${step}`} variant='outline'>
          Edit
        </Link>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-7`}>{children}</div>
    </div>
  );
};

interface ReviewItemProps {
  label: string;
  value?: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ label, value }) => {
  return (
    <div className=''>
      <h3 className='font-bold mb-2'>{label}</h3>
      {value ? <p className='break-words'>{value}</p> : null}
    </div>
  );
};

interface ReviewItemListProps {
  label: string;
  values?: (string | undefined)[];
}

const ReviewItemList: React.FC<ReviewItemListProps> = ({ label, values }) => {
  return (
    <div className=''>
      <h3 className='font-bold mb-2'>{label}</h3>
      {values ? (
        <ul>
          {values?.map(value => (
            <li key={value} className='mb-2'>
              {value}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

interface ReviewSpecialtyProps {
  specialty: SpecialtyDTO;
}
const ReviewSpecialty: React.FC<ReviewSpecialtyProps> = ({ specialty }) => {
  if (!specialty.id) return null;
  return (
    <div className='grid grid-cols-2 rounded border border-gray-300 p-2'>
      <ReviewItem label='Main Speciality' value={getSpecialtyLabelById(specialty.id)} />
      <ReviewItemList
        label='Subspeciality'
        values={specialty.subspecialties?.map(subspecialty =>
          getSubspecialtyLabelById(subspecialty.id),
        )}
      />
    </div>
  );
};

interface ReviewDeploymentHsdaProps {
  lhas: string[];
}

const ReviewDeploymentHsda: React.FC<ReviewDeploymentHsdaProps> = ({ lhas }) => {
  const haStructure = rebuildHaStructure(lhas);
  const has = Object.values(haStructure);
  return (
    <div className='flex flex-col gap-3'>
      <h3 className='font-bold'>
        Indicate the locations you are willing to support (click on the drop-down in each region and
        select the locations)
      </h3>
      {has.map(ha => (
        <div key={ha.id}>
          <h4 className='font-bold mb-2'>{ha.name}</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 justify-content-stretch'>
            {Object.values(ha.hsdas).map(hsda => (
              <div key={hsda.id}>
                <h5 className='mb-1'>{hsda.name}</h5>
                <ul
                  key={ha.id}
                  className='flex flex-col gap-2 py-4 px-5 rounded border border-gray-300'
                >
                  {hsda.lhas.map((lha: Lha) => (
                    <li key={lha.id} className=''>
                      {lha.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
