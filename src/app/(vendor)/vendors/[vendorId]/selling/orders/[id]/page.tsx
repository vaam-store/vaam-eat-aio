type SellerOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SellerOrderDetailPage({
  params,
}: SellerOrderDetailPageProps) {
  const { id } = await params;
  return (
    <div>
      <h1>Sales Order Detail: {id}</h1>
      <p>Details for sales order {id}.</p>
      {/* TODO: Display sales order details, customer info, shipping status */}
    </div>
  );
}
