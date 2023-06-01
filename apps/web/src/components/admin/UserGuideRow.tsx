import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { mutate } from 'swr';
import { UserGuide } from '@ien/common';
import { Disclosure } from '@components';
import {
  deleteUserGuide,
  getSignedUrlOfUserGuide,
  getUserGuideVersions,
  restoreUserGuide,
} from '../../services/admin';

interface UserGuideProps {
  file: UserGuide;
  showVersions: boolean;
}

export const UserGuideRow = ({ file, showVersions }: UserGuideProps) => {
  const [versions, setVersions] = useState<UserGuide[]>();
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string | undefined>();

  const getVersions = (open: boolean) => {
    if (open) {
      getUserGuideVersions(file.name)
        .then(setVersions)
        .catch(() => setVersions([]));
    }
  };

  const openFile = (name: string, version?: string) => {
    setSelectedVersion(version);
    setLoading(true);
    getSignedUrlOfUserGuide(name, version)
      .then(window.open)
      .finally(() => setLoading(false));
  };

  const getSizeWithUnit = (size: number): string => {
    if (size > 1024 ** 2) {
      return `${(size / 1024 ** 2).toFixed(1)}M`;
    } else if (size > 1024) {
      return `${(size / 1024).toFixed(1)}K`;
    }
    return `${size}B`;
  };

  const deleteFile = (name: string, version?: string) => {
    setSelectedVersion(version);
    setLoading(true);
    deleteUserGuide(name, version)
      .then(() => {
        return mutate('/admin/user-guides');
      })
      .then(() => {
        if (version) {
          return getVersions(true);
        }
      })
      .finally(() => setLoading(false));
  };

  const restoreFile = (name: string, version: string) => {
    setSelectedVersion(version);
    setLoading(true);
    restoreUserGuide(name, version)
      .then(() => {
        return mutate('/admin/user-guides');
      })
      .then(() => getVersions(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!loading) setSelectedVersion(undefined);
  }, [loading]);

  const getUserGuideRow = ({ name, lastModified, version, size }: UserGuide, index = -1) => {
    const padding = version ? 'py-2 pl-3' : '';
    return (
      <div className={`flex flex-row align-middle ${padding}`} key={name + version}>
        <div style={{ minWidth: '180px' }}>{dayjs(lastModified).format('MMM D, YYYY hh:mm A')}</div>
        <div
          className='ml-4 underline text-bcBlueLink visited:text-bcBluePrimary cursor-pointer'
          onClick={e => {
            e.stopPropagation();
            openFile(name, version);
          }}
        >
          {version ? getSizeWithUnit(size) : name}
        </div>
        {!(index === 0 && versions?.length === 1) && (
          <FontAwesomeIcon
            icon={faTrash}
            className='h-4 ml-5 my-auto cursor-pointer text-bcGray'
            onClick={() => deleteFile(name, version)}
            title='Delete'
          />
        )}
        {index === 0 && <div className='ml-4'>Current</div>}
        {version && index > 0 && (
          <FontAwesomeIcon
            icon={faReply}
            className='h-4 ml-5 my-auto cursor-pointer text-bcBluePrimary'
            onClick={() => restoreFile(name, version)}
            title='Restore'
          />
        )}
        {loading && version === selectedVersion && (
          <FontAwesomeIcon icon={faSpinner} className='animate-spin h-6 ml-5' />
        )}
      </div>
    );
  };

  const getVersionList = () => {
    return (
      <div className='pb-5 w-full text-center'>
        {(loading && !selectedVersion) || !versions ? (
          <FontAwesomeIcon icon={faSpinner} className='animate-spin h-6 min-w-1/4 text-center' />
        ) : (
          versions.map((v, index) => getUserGuideRow(v, index))
        )}
      </div>
    );
  };

  return (
    <div className='my-1'>
      {showVersions ? (
        <Disclosure
          shouldExpand={false}
          buttonText={
            <div className='w-full flex flex-row p-2 text-left'>{getUserGuideRow(file)}</div>
          }
          content={<div className='pl-8'>{getVersionList()}</div>}
          onChange={getVersions}
        />
      ) : (
        getUserGuideRow(file)
      )}
    </div>
  );
};
