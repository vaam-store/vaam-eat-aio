import { api } from "@app/trpc/server";
import { notFound } from "next/navigation";
import React from "react";

type VendorPageProps = {
  params: {
    vendorid: string;
  };
};

export default async function VendorPage({ params }: VendorPageProps) {
  const { vendorid } = params;

  if (!vendorid) {
    notFound();
  }

  const vendor = await api.zen.vendor.findUnique({
    where: { id: vendorid },
    // You can include more relations here if needed, e.g., contacts, locations
    // include: {
    //   contacts: true,
    //   locations: true,
    // }
  });

  if (!vendor) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Vendor Details</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">
            {vendor.name || "Unnamed Vendor"}
          </h2>
          <p>
            <strong>ID:</strong> {vendor.id}
          </p>
          <p>
            <strong>Status:</strong> {vendor.enabled ? "Enabled" : "Disabled"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(vendor.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(vendor.updatedAt).toLocaleDateString()}
          </p>
          {/* Add more vendor details here as needed */}
          {/* For example, to display contacts if included:
          {vendor.contacts && vendor.contacts.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Contacts:</h3>
              <ul className="list-disc pl-5">
                {vendor.contacts.map(contact => (
                  <li key={contact.id}>
                    {contact.contactInfo.name} ({contact.type}) - {contact.contactInfo.email || contact.contactInfo.phone.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
          */}
        </div>
      </div>
    </div>
  );
}
