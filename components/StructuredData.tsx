'use client'

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DD-SHOP",
    "alternateName": "Core Innovation",
    "legalName": "DD IOT SOLUTIONS",
    "url": "https://dd-products.vercel.app",
    "logo": "https://dd-products.vercel.app/images/logo.jpeg",
    "description": "Leading provider of IoT products, ready-made projects, software development, and custom IoT solutions. Smart home automation, Industry 4.0, ESP32/Arduino projects.",
    "email": "contact@ddshop.com",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "MSME/Udyam",
      "value": "UDYAM-TN-04-0124631"
    },
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "name": "MSME/Udyam Registration",
      "credentialCategory": "Government Registration",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Government of India"
      },
      "identifier": "UDYAM-TN-04-0124631",
      "url": "https://dd-products.vercel.app/certificates/DD-IOT-SOLUTION-GOVT-CERTIFICATE.pdf"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-6369704741",
      "contactType": "customer service",
      "availableLanguage": ["English", "Tamil"]
    },
    "founder": {
      "@type": "Person",
      "name": "DURAI B",
      "jobTitle": "Founder & IoT Engineer",
      "sameAs": [
        "https://www.facebook.com/durai.b.473058323",
        "https://twitter.com/Durai4444"
      ]
    },
    "sameAs": [
      "https://www.facebook.com/durai.b.473058323",
      "https://twitter.com/Durai4444"
    ]
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "DD-SHOP - IoT Products & Custom Development",
    "legalName": "DD IOT SOLUTIONS",
    "image": "https://dd-products.vercel.app/images/logo.jpeg",
    "description": "Buy IoT products, ready-made projects, and custom development services. Smart home automation, Industry 4.0 solutions, ESP32/Arduino projects, web & mobile apps.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "url": "https://dd-products.vercel.app",
    "telephone": "+91-6369704741",
    "priceRange": "₹₹",
    "openingHours": "Mo-Su 00:00-23:59",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, Credit Card, UPI",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "MSME/Udyam",
      "value": "UDYAM-TN-04-0124631"
    }
    ,"founder": {
      "@type": "Person",
      "name": "DURAI B"
    }
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "IoT Product Sales & Custom Development",
    "provider": {
      "@type": "Organization",
      "name": "DD-SHOP"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "IoT Products & Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "IoT Products for Sale",
            "description": "Ready-to-use IoT devices, smart home products, ESP32/Arduino based solutions"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Ready-Made IoT Projects",
            "description": "Complete IoT project solutions for home automation, industry 4.0, and smart devices"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom IoT Development",
            "description": "Tailored IoT hardware and software solutions designed for your specific needs"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Software Development",
            "description": "Web development, mobile apps, and software solutions"
          }
        }
      ]
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DD-SHOP",
    "url": "https://dd-products.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://dd-products.vercel.app/products?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}
