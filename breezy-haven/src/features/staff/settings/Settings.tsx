import { staffSettingService } from '@/services';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  errorHelper,
  Spinner,
} from '@/shared';
import { Suspense } from 'react';
import { SettingForm } from './SettingForm';

export async function Settings() {
  // TODO: verify staff authentication

  const { data, errors } = await staffSettingService.getAll();

  if (errors) throw errorHelper.handleError(errors);

  const setting = data.at(0);

  if (!setting) throw new Error('Settings do not exist');

  return (
    <Suspense fallback={<Spinner />}>
      <Card className='mx-auto w-fit'>
        <CardHeader>
          <CardTitle>Update Settings</CardTitle>
          <CardDescription>
            Update The Breezy Haven preferences below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingForm defaultSetting={setting} />
        </CardContent>
      </Card>
    </Suspense>
  );
}
