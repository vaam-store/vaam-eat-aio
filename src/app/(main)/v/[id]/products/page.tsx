type VendorProductsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VendorProductsPage({
  params,
}: VendorProductsPageProps) {
  const { id } = await params;
  return (
    <div>
      <h1>Products by Vendor: {id}</h1>
      <p>All products from vendor {id}.</p>
      {/* TODO: List all products by this vendor */}
    </div>
  );
}
