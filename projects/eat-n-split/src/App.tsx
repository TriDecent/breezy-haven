import { BillSplitting } from './bill-splitting';
import { Friends } from './friends-management';
import { PageLayout } from './shared';

function App() {
  return (
    <PageLayout>
      <PageLayout.Header />
      <PageLayout.Main>
        <div className='flex flex-col gap-4 lg:flex-row lg:gap-8'>
          <section className='flex flex-1 flex-col gap-1'>
            <Friends />
          </section>

          <section className='h-fit flex-1 rounded-lg bg-amber-100/70 p-4 shadow-xs shadow-black'>
            <h2 className='mb-2 text-lg font-bold tracking-wider uppercase'>
              Split a bill with clare
            </h2>
            <BillSplitting />
          </section>
        </div>
      </PageLayout.Main>
      <PageLayout.Footer />
    </PageLayout>
  );
}

export default App;
