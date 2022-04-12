import { render, screen } from '@testing-library/react';
import { Pagination } from '../../src/components/Pagination';

describe('Pagination', () => {
  it('renders a pagination bar', async () => {
    const mock = jest.fn();

    const pageIndex = 3;
    const pageSize = 10;
    const total = 37;

    render(<Pagination pageOptions={{ pageIndex, pageSize, total }} onChange={mock} />);

    const elements = screen.getAllByRole('select');
    expect(elements.length).toBe(2);

    const pageSizeOption = screen.getByRole('option', { name: `${pageSize}` });
    expect((pageSizeOption as HTMLOptionElement).selected).toBeTruthy();

    const pageIndexOption = screen.getByRole('option', { name: `${pageIndex}` });
    expect((pageIndexOption as HTMLOptionElement).selected).toBeTruthy();

    const start = pageSize * (pageIndex - 1) + 1;
    const end = pageSize * pageIndex < total ? pageSize * pageIndex : total;
    expect(screen.getByText(`${start} - ${end} of ${total} items`));
    expect(screen.getByText(`of ${Math.ceil(total / pageSize)} pages`));
  });
});
