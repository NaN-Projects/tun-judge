import React, { useState } from 'react';
import { Container, Dropdown, Icon, Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { Tabs } from '../../core/types';
import { observer } from 'mobx-react';
import { rootStore } from '../../core/stores/RootStore';

const tabs: Tabs = [
  {
    key: '',
    title: 'Home',
    icon: 'home',
  },
  {
    key: 'problems',
    title: 'Problem Set',
    icon: 'file alternate',
  },
  {
    key: 'scoreboard',
    title: 'Scoreboard',
    icon: 'list ol',
  },
];

const TeamNavbar: React.FC = observer(() => {
  const [currentTab, setCurrentTab] = useState(location.pathname.replace(/\/?/g, ''));
  const history = useHistory();
  const { profile } = rootStore;

  const onLinkClick = (tab: string) => {
    setCurrentTab(tab);
    history.push(`/${tab}`);
  };

  return (
    <Menu fixed="top" borderless inverted>
      <Container>
        <Menu.Item as="a" header onClick={() => onLinkClick('')}>
          TUN-JUDGE
        </Menu.Item>
        {tabs.map((tab) => (
          <Menu.Item
            key={tab.key}
            as="a"
            active={currentTab === tab.key}
            onClick={() => onLinkClick(tab.key)}
          >
            <Icon name={tab.icon} />
            {tab.title}
          </Menu.Item>
        ))}
        <Menu.Menu position="right">
          <Menu.Item>
            <Icon name="clock" />
            contest_time
          </Menu.Item>
          <Dropdown
            item
            floating
            icon={
              <>
                <Icon name="user circle" />
                {profile?.username ?? '-'}
              </>
            }
          >
            <Dropdown.Menu>
              <Dropdown.Item text="Logout" icon="log out" onClick={() => history.push('/logout')} />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Container>
    </Menu>
  );
});

export default TeamNavbar;