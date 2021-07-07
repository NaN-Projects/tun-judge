import { Menu, Transition } from '@headlessui/react';
import { LogoutIcon, UserIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Submission } from '../../core/models';
import { rootStore } from '../../core/stores/RootStore';
import ActiveContestSelector from '../shared/ActiveContestSelector';
import NavBar from '../shared/NavBar';
import SubmitForm from './views/SubmitForm';

type Tabs = '' | 'problems' | 'scoreboard';

const TeamNavbar: React.FC = observer(() => {
  const [submitFormOpen, setSubmitFormOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState(location.pathname.replace(/\/?/g, ''));
  const history = useHistory();
  const {
    profile,
    publicStore: { currentContest },
    teamStore: { sendSubmission },
  } = rootStore;

  const onLinkClick = (tab: Tabs) => {
    setCurrentTab(tab);
    history.push(`/${tab}`);
  };

  return (
    <>
      <NavBar
        logo={
          <div
            className="text-white text-xl font-medium cursor-pointer"
            onClick={() => onLinkClick('')}
          >
            TunJudge
          </div>
        }
        leftItems={[
          {
            content: 'Home',
            active: currentTab === '',
            onClick: () => onLinkClick(''),
          },
          {
            content: 'Problem Set',
            active: currentTab === 'problems',
            onClick: () => onLinkClick('problems'),
          },
          {
            content: 'Scoreboard',
            active: currentTab === 'scoreboard',
            onClick: () => onLinkClick('scoreboard'),
          },
        ]}
        rightItems={[
          {
            content: 'Submit',
            active: true,
            className: 'bg-green-600 hover:bg-green-700',
            onClick: () => setSubmitFormOpen(true),
          },
          { content: <ActiveContestSelector className="text-white" /> },
          {
            content: (
              <Menu as="div" className="relative">
                <Menu.Button
                  as="div"
                  className="flex items-center justify-center gap-1 rounded-md cursor-pointer hover:bg-gray-700"
                >
                  <UserIcon className="h-4 w-4" />
                  {profile?.name ?? '-'}
                </Menu.Button>
                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="text-black absolute right-0  mt-4 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg outline-none">
                    <Menu.Item onClick={() => history.push('/logout')}>
                      <div className="flex items-center rounded-md gap-1 px-3 py-2 cursor-pointer hover:bg-gray-200">
                        <LogoutIcon className="h-4 w-4" />
                        Logout
                      </div>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ),
          },
        ]}
      />
      <SubmitForm
        isOpen={submitFormOpen}
        item={{} as Submission}
        onClose={() => setSubmitFormOpen(false)}
        onSubmit={async (submission) => {
          await sendSubmission(currentContest!.id, profile!.team.id, submission);
          setSubmitFormOpen(false);
        }}
      />
    </>
  );
});

export default TeamNavbar;
