import * as React from 'react';

interface MetaTagsProps {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
    ogUrl?: string;
    twitterCard?: 'summary' | 'summary_large_image';
    twitterSite?: string;
    canonical?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
    title,
    description,
    keywords = 'banking, finance, digital banking, online banking, neo bank, fintech',
    ogImage = '/og-image.png',
    ogUrl,
    twitterCard = 'summary_large_image',
    twitterSite = '@neobank',
    canonical,
}) => {
    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            {ogUrl && <meta property="og:url" content={ogUrl} />}
            <meta property="og:type" content="website" />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:site" content={twitterSite} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Canonical */}
            {canonical && <link rel="canonical" href={canonical} />}
        </>
    );
};

interface StructuredDataProps {
    type?: 'Organization' | 'FinancialProduct' | 'WebSite';
    data?: Record<string, unknown>;
}

export const StructuredData: React.FC<StructuredDataProps> = ({
    type = 'Organization',
    data,
}) => {
    const defaultData = {
        '@context': 'https://schema.org',
        '@type': type,
        name: 'NeoBank',
        description: 'Modern digital banking platform',
        url: 'https://neobank.com',
        logo: 'https://neobank.com/logo.png',
        sameAs: [
            'https://twitter.com/neobank',
            'https://linkedin.com/company/neobank',
            'https://instagram.com/neobank',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-800-NEO-BANK',
            contactType: 'customer service',
            availableLanguage: 'English',
        },
        areaServed: {
            '@type': 'Place',
            name: 'United States',
        },
        foundingDate: '2024',
        numberOfEmployees: {
            '@type': 'QuantitativeValue',
            minValue: 50,
            maxValue: 200,
        },
    };

    const structuredData = data ? { ...defaultData, ...data } : defaultData;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
};

export default MetaTags;
