import Add from './_add';
import Agents from './_agents';
import FileAttach from './_attach';
import Attendence from './_attendence';
import BackArrow from './_backArrow';
import Backward from './_backward';
import BronzeIcon from './_bronze';
import Close from './_close';
import Colleges from './_college';
import Dashboard from './_dashboard';
import DefaultLoader from './_defaultLoader';
import { DeleteIcon } from './_delete';
import { DownloadIcon } from './_download';
import DownArrow from './_dropdown';
import { EditIcon } from './_edit';
import Employees from './_employees';
import { EyeIcon } from './_eyeIcon';
import Filter from './_filter';
import Forward from './_forward';
import GoldIcon from './_gold';
import HomeIcon from './_home';
import Info from './_info';
import KebabIcon from './_kebabIcon';
import Menu from './_menu';
import MoreIcon from './_moreIcon';
import NotificationIcon from './_notification';
import PlusIcon from './_plus';
import SilverIcon from './_silver';
import Students from './_students';
import Upload from './_upload';

const iconObject: { [key: string]: (props: any) => JSX.Element } = {
  default: () => <DefaultLoader />,
  dashboard: () => <Dashboard />,
  employees: () => <Employees />,
  agents: () => <Agents />,
  students: () => <Students />,
  menu: () => <Menu />,
  close: (props) => <Close {...props} />,
  upload: () => <Upload />,
  info: () => <Info />,
  downArrow: () => <DownArrow />,
  edit: () => <EditIcon />,
  download: () => <DownloadIcon />,
  delete: () => <DeleteIcon />,
  eye: () => <EyeIcon />,
  forward: () => <Forward />,
  backward: () => <Backward />,
  filter: () => <Filter />,
  kebabIcon: () => <KebabIcon />,
  backArrow: () => <BackArrow />,
  fileAttach: () => <FileAttach />,
  add: () => <Add />,
  colleges: () => <Colleges />,
  Gold: () => <GoldIcon />,
  Silver: () => <SilverIcon />,
  Bronze: () => <BronzeIcon />,
  Notification: () => <NotificationIcon />,
  'attendence-list': () => <Attendence />,
  MoreIcon: () => <MoreIcon />,
  plus: () => <PlusIcon />,
  home: () => <HomeIcon />,
};
const GetIcons = (iconName = 'default', props = {}): JSX.Element => {
  return iconObject[iconName](props) || iconObject['default'](props);
};
export default GetIcons;
