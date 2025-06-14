type VendorProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VendorProfilePage({
  params,
}: VendorProfilePageProps) {
  const { id } = await params;
  return (
    <div>
      <h1>Vendor Profile: {id}</h1>
      <p>Information about vendor {id}.</p>
      {/* TODO: Display seller info, rating, featured products, reviews */}
    </div>
  );
}
