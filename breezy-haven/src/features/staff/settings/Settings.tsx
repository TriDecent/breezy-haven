import { staffSettingService } from '@/services';
import { errorHelper } from '@/shared';
import { SettingForm } from './SettingForm';

export async function Settings() {
  const { data, errors } = await staffSettingService.getAll();

  if (errors) throw errorHelper.handleError(errors);

  const setting = data.at(0);

  if (!setting) throw new Error('Settings do not exist');

  return <SettingForm defaultSetting={setting} />;
}
