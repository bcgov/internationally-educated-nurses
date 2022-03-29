import Link from 'next/link';

const navLinks = [
  { link: 'Manage Applicants', route: '/' },
  { link: 'Reporting', route: '/' },
];

export const Navbar: React.FC = () => {
  // @todo add active class check for font-bold
  return (
    <div className='h-10'>
      <div className='w-full flex bg-bcBlueAccent left-0 right-0 justify-center '>
        <div className='w-full 2xl:w-2/3 h-10 flex flex-row items-center align-center justify-between px-2 md:px-12'>
          <div className='layout-grid gap-8 h-full flex flex-row items-center align-center'>
            {navLinks.map(({ link, route }) => (
              <Link href={route} key={link}>
                <a
                  className={`text-xs ${
                    link === 'Manage Applicants' ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {link}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
