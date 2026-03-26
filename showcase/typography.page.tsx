import * as React from 'react';
import { PageGrid, PageGridRow, PageGridCol } from 'shared/components/PageGrid/page-grid';
import { Divider } from 'shared/components/Divider';

export const frontmatter = {
  seo: {
    title: 'Typography Showcase',
    description: 'A comprehensive showcase of the XRPL.org typography system including displays, headings, subheads, body text, and labels.',
  },
};

export default function TypographyShowcase() {
  return (
    <div className="landing">
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse col-lg-8 mx-auto">
          <h1 className="mb-0">Typography System</h1>
          <h6 className="eyebrow mb-3">Brand Design System</h6>
        </div>
        <p className="col-lg-8 mx-auto mt-10">
          A comprehensive overview of the XRPL typography system featuring responsive type scales, 
          font families (Booton and Tobias), and semantic styling for consistent visual hierarchy.
        </p>
      </section>

      {/* Display Styles */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Display Styles</h2>
          <h6 className="eyebrow mb-3">Largest Headlines</h6>
        </div>
        <p className="mb-10 text-muted">
          Display styles are used for the largest, most prominent headlines. They feature negative letter spacing
          and are optimized for impact at large sizes.
        </p>

        <div className="d-flex flex-column gap-10">
          <div>
            <div className="mb-3">
              <code className="text-muted">display-lg</code>
              <span className="text-muted mx-2">·</span>
              <span className="text-muted">Booton Light (300)</span>
            </div>
            <div className="display-lg">Display Large</div>
            <div className="mt-4">
              <table className="w-100" style={{ fontSize: '14px' }}>
                <thead>
                  <tr className="text-muted">
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Breakpoint</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Size</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Line Height</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Letter Spacing</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Paragraph Spacing</th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  <tr><td>Mobile</td><td>64px</td><td>71px</td><td>-4.5px</td><td>32px</td></tr>
                  <tr><td>Tablet</td><td>72px</td><td>79px</td><td>-5px</td><td>32px</td></tr>
                  <tr><td>Desktop</td><td>92px</td><td>112px</td><td>-6px</td><td>32px</td></tr>
                  <tr><td>XL</td><td>112px</td><td>112px</td><td>-7px</td><td>32px</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <code className="text-muted">display-md</code>
              <span className="text-muted mx-2">·</span>
              <span className="text-muted">Tobias Light (300)</span>
            </div>
            <div className="display-md">Display Medium</div>
            <div className="mt-4">
              <table className="w-100" style={{ fontSize: '14px' }}>
                <thead>
                  <tr className="text-muted">
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Breakpoint</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Size</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Line Height</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Letter Spacing</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Paragraph Spacing</th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  <tr><td>Mobile</td><td>48px</td><td>53px</td><td>-2px</td><td>32px</td></tr>
                  <tr><td>Tablet</td><td>60px</td><td>66px</td><td>-2px</td><td>32px</td></tr>
                  <tr><td>Desktop</td><td>72px</td><td>75.6px</td><td>-3px</td><td>32px</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <code className="text-muted">display-sm</code>
              <span className="text-muted mx-2">·</span>
              <span className="text-muted">Tobias Light (300)</span>
            </div>
            <div className="display-sm">Display Small</div>
            <div className="mt-4">
              <table className="w-100" style={{ fontSize: '14px' }}>
                <thead>
                  <tr className="text-muted">
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Breakpoint</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Size</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Line Height</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Letter Spacing</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Paragraph Spacing</th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  <tr><td>Mobile</td><td>40px</td><td>46px</td><td>-1px</td><td>16px</td></tr>
                  <tr><td>Tablet</td><td>56px</td><td>64px</td><td>-1px</td><td>16px</td></tr>
                  <tr><td>Desktop</td><td>64px</td><td>70.4px</td><td>-1.5px</td><td>32px</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Heading Styles */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Heading Styles</h2>
          <h6 className="eyebrow mb-3">Section Headers</h6>
        </div>
        <p className="mb-10 text-muted">
          Heading styles are used for major section headers and page titles. All headings use the Tobias monospace
          font family with Light weight (300) for a distinctive technical aesthetic.
        </p>

        <div className="d-flex flex-column gap-10">
          <div>
            <div className="mb-3">
              <code className="text-muted">heading-lg / .h-lg</code>
              <span className="text-muted mx-2">·</span>
              <span className="text-muted">Tobias Light (300)</span>
            </div>
            <div className="h-lg">Heading Large</div>
            <div className="mt-4">
              <table className="w-100" style={{ fontSize: '14px' }}>
                <thead>
                  <tr className="text-muted">
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Breakpoint</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Size</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Line Height</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Letter Spacing</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Paragraph Spacing</th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  <tr><td>Mobile</td><td>36px</td><td>41px</td><td>-0.25px</td><td>16px</td></tr>
                  <tr><td>Tablet</td><td>42px</td><td>48px</td><td>-0.5px</td><td>16px</td></tr>
                  <tr><td>Desktop</td><td>48px</td><td>52.8px</td><td>-1px</td><td>32px</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <code className="text-muted">heading-md / .h-md</code>
              <span className="text-muted mx-2">·</span>
              <span className="text-muted">Tobias Light (300)</span>
            </div>
            <div className="h-md">Heading Medium</div>
            <div className="mt-4">
              <table className="w-100" style={{ fontSize: '14px' }}>
                <thead>
                  <tr className="text-muted">
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Breakpoint</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Size</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Line Height</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Letter Spacing</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Paragraph Spacing</th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  <tr><td>Mobile</td><td>32px</td><td>40px</td><td>0px</td><td>16px</td></tr>
                  <tr><td>Tablet</td><td>36px</td><td>45px</td><td>-0.5px</td><td>16px</td></tr>
                  <tr><td>Desktop</td><td>40px</td><td>46px</td><td>-1px</td><td>16px</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <code className="text-muted">heading-sm / .h-sm</code>
              <span className="text-muted mx-2">·</span>
              <span className="text-muted">Tobias Light (300)</span>
            </div>
            <div className="h-sm">Heading Small</div>
            <div className="mt-4">
              <table className="w-100" style={{ fontSize: '14px' }}>
                <thead>
                  <tr className="text-muted">
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Breakpoint</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Size</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Line Height</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Letter Spacing</th>
                    <th style={{ fontWeight: 'normal', paddingBottom: '8px' }}>Paragraph Spacing</th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  <tr><td>Mobile</td><td>24px</td><td>35px</td><td>-0.25px</td><td>16px</td></tr>
                  <tr><td>Tablet</td><td>28px</td><td>35px</td><td>-0.25px</td><td>16px</td></tr>
                  <tr><td>Desktop</td><td>32px</td><td>40px</td><td>-0.5px</td><td>16px</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h5 className="mb-4">Legacy H1-H6 Styles</h5>
          <p className="mb-6 text-muted">
            Traditional semantic HTML heading tags using Tobias Regular (400). These are legacy styles maintained for backward compatibility.
          </p>

          <div className="d-flex flex-column gap-6">
            <div>
              <code className="text-muted mb-2 d-block">h1, .h1</code>
              <h1 className="mb-2">The quick brown fox jumps</h1>
              <small className="text-muted">Desktop: 62px (line: 70px) · Mobile: 42px (line: 48px)</small>
            </div>
            <div>
              <code className="text-muted mb-2 d-block">h2, .h2</code>
              <h2 className="mb-2">The quick brown fox jumps</h2>
              <small className="text-muted">Desktop: 56px (line: 62px) · Mobile: 28px (line: 34px)</small>
            </div>
            <div>
              <code className="text-muted mb-2 d-block">h3, .h3</code>
              <h3 className="mb-2">The quick brown fox jumps</h3>
              <small className="text-muted">Desktop: 48px (line: 52px) · Mobile: 24px (line: 28px)</small>
            </div>
            <div>
              <code className="text-muted mb-2 d-block">h4, .h4</code>
              <h4 className="mb-2">The quick brown fox jumps over the lazy dog</h4>
              <small className="text-muted">Desktop: 32px (line: 38px) · Mobile: 20px (line: 26px)</small>
            </div>
            <div>
              <code className="text-muted mb-2 d-block">h5, .h5</code>
              <h5 className="mb-2">The quick brown fox jumps over the lazy dog</h5>
              <small className="text-muted">Desktop: 24px (line: 32px) · Mobile: 18px (line: 26px)</small>
            </div>
            <div>
              <code className="text-muted mb-2 d-block">h6, .h6</code>
              <h6 className="mb-2">The quick brown fox jumps over the lazy dog</h6>
              <small className="text-muted">Desktop: 20px (line: 26px) · Mobile: 16px (line: 24px)</small>
            </div>
          </div>
        </div>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Subhead Styles */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Subhead Styles</h2>
          <h6 className="eyebrow mb-3">Supporting Headers</h6>
        </div>
        <p className="mb-10 text-muted">
          Subheads provide intermediate hierarchy between headings and body text. All subheads use the Booton
          sans-serif font family. Available in two weights: Regular (400) for emphasis and Light (300) for subtler styling.
        </p>

        <div className="d-flex flex-column gap-10">
          {/* Large Subheads */}
          <div>
            <h5 className="mb-6">Large Subheads · Booton</h5>
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={{ base: 4, lg: 6 }}>
                  <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                    <code className="text-muted mb-3 d-block">subhead-lg-r / .sh-lg-r</code>
                    <div className="sh-lg-r mb-4">Regular Weight Subhead</div>
                    <table className="w-100" style={{ fontSize: '12px' }}>
                      <thead>
                        <tr className="text-muted">
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>BP</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Size</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Line</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Letter</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>P-Space</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted">
                        <tr><td>Mobile</td><td>24px</td><td>30px</td><td>-1px</td><td>16px</td></tr>
                        <tr><td>Tablet</td><td>28px</td><td>35px</td><td>-0.75px</td><td>16px</td></tr>
                        <tr><td>Desktop</td><td>32px</td><td>40px</td><td>-0.5px</td><td>16px</td></tr>
                      </tbody>
                    </table>
                  </div>
                </PageGridCol>
                <PageGridCol span={{ base: 4, lg: 6 }}>
                  <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                    <code className="text-muted mb-3 d-block">subhead-lg-l / .sh-lg-l</code>
                    <div className="sh-lg-l mb-4">Light Weight Subhead</div>
                    <table className="w-100" style={{ fontSize: '12px' }}>
                      <thead>
                        <tr className="text-muted">
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>BP</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Size</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Line</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Letter</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>P-Space</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted">
                        <tr><td>Mobile</td><td>24px</td><td>30px</td><td>-1px</td><td>16px</td></tr>
                        <tr><td>Tablet</td><td>28px</td><td>35px</td><td>-1px</td><td>16px</td></tr>
                        <tr><td>Desktop</td><td>32px</td><td>40px</td><td>-1px</td><td>16px</td></tr>
                      </tbody>
                    </table>
                  </div>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
          </div>

          {/* Medium Subheads */}
          <div>
            <h5 className="mb-6">Medium Subheads · Booton</h5>
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={{ base: 4, lg: 6 }}>
                  <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                    <code className="text-muted mb-3 d-block">subhead-md-r / .sh-md-r</code>
                    <div className="sh-md-r mb-4">Regular Weight Subhead</div>
                    <table className="w-100" style={{ fontSize: '12px' }}>
                      <thead>
                        <tr className="text-muted">
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>BP</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Size</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Line</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Letter</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>P-Space</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted">
                        <tr><td>Mobile</td><td>24px</td><td>30px</td><td>-1px</td><td>16px</td></tr>
                        <tr><td>Tablet</td><td>26px</td><td>33px</td><td>-1px</td><td>16px</td></tr>
                        <tr><td>Desktop</td><td>28px</td><td>35px</td><td>-1px</td><td>16px</td></tr>
                      </tbody>
                    </table>
                  </div>
                </PageGridCol>
                <PageGridCol span={{ base: 4, lg: 6 }}>
                  <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                    <code className="text-muted mb-3 d-block">subhead-md-l / .sh-md-l</code>
                    <div className="sh-md-l mb-4">Light Weight Subhead</div>
                    <table className="w-100" style={{ fontSize: '12px' }}>
                      <thead>
                        <tr className="text-muted">
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>BP</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Size</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Line</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Letter</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>P-Space</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted">
                        <tr><td>Mobile</td><td>24px</td><td>30px</td><td>-1px</td><td>16px</td></tr>
                        <tr><td>Tablet</td><td>26px</td><td>33px</td><td>-1px</td><td>16px</td></tr>
                        <tr><td>Desktop</td><td>28px</td><td>35px</td><td>-1px</td><td>16px</td></tr>
                      </tbody>
                    </table>
                  </div>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
          </div>

          {/* Small Subheads */}
          <div>
            <h5 className="mb-6">Small Subheads · Booton</h5>
            <PageGrid>
              <PageGridRow>
                <PageGridCol span={{ base: 4, lg: 6 }}>
                  <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                    <code className="text-muted mb-3 d-block">subhead-sm-r / .sh-sm-r</code>
                    <div className="sh-sm-r mb-4">Regular Weight Subhead</div>
                    <table className="w-100" style={{ fontSize: '12px' }}>
                      <thead>
                        <tr className="text-muted">
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>BP</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Size</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Line</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Letter</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>P-Space</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted">
                        <tr><td>Mobile</td><td>18px</td><td>23px</td><td>-0.5px</td><td>16px</td></tr>
                        <tr><td>Tablet</td><td>18px</td><td>23px</td><td>-0.5px</td><td>16px</td></tr>
                        <tr><td>Desktop</td><td>24px</td><td>30px</td><td>-1px</td><td>16px</td></tr>
                      </tbody>
                    </table>
                  </div>
                </PageGridCol>
                <PageGridCol span={{ base: 4, lg: 6 }}>
                  <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                    <code className="text-muted mb-3 d-block">subhead-sm-l / .sh-sm-l</code>
                    <div className="sh-sm-l mb-4">Light Weight Subhead</div>
                    <table className="w-100" style={{ fontSize: '12px' }}>
                      <thead>
                        <tr className="text-muted">
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>BP</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Size</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Line</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Letter</th>
                          <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>P-Space</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted">
                        <tr><td>Mobile</td><td>18px</td><td>23px</td><td>-0.5px</td><td>16px</td></tr>
                        <tr><td>Tablet</td><td>18px</td><td>23px</td><td>-0.5px</td><td>16px</td></tr>
                        <tr><td>Desktop</td><td>24px</td><td>30px</td><td>-1px</td><td>16px</td></tr>
                      </tbody>
                    </table>
                  </div>
                </PageGridCol>
              </PageGridRow>
            </PageGrid>
          </div>
        </div>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Body Text */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Body Text</h2>
          <h6 className="eyebrow mb-3">Content Typography</h6>
        </div>
        <p className="mb-10 text-muted">
          Body text styles use the Booton sans-serif font family for main content areas. Available in Regular (400)
          for standard text and Light (300) for less prominent content.
        </p>

        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <code className="text-muted mb-3 d-block">body-r / .body-r · Booton Regular (400)</code>
                <div className="body-r mb-4">
                  The quick brown fox jumps over the lazy dog. This is the standard body text style
                  used throughout the site. It provides good readability at comfortable sizes across
                  all devices.
                </div>
                <table className="w-100" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr className="text-muted">
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Breakpoint</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Size</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Line Height</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Letter Spacing</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>P-Space</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    <tr><td>Mobile/Tablet</td><td>16px</td><td>23.2px</td><td>0px</td><td>16px</td></tr>
                    <tr><td>Desktop</td><td>18px</td><td>26.1px</td><td>-0.5px</td><td>16px</td></tr>
                  </tbody>
                </table>
              </div>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <code className="text-muted mb-3 d-block">body-l / .body-l · Booton Light (300)</code>
                <div className="body-l mb-4">
                  The quick brown fox jumps over the lazy dog. This is the light body text style
                  for secondary content. It maintains the same size as regular body but with lighter
                  weight for visual hierarchy.
                </div>
                <table className="w-100" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr className="text-muted">
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Breakpoint</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Size</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Line Height</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Letter Spacing</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>P-Space</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    <tr><td>Mobile/Tablet</td><td>16px</td><td>23.2px</td><td>0px</td><td>16px</td></tr>
                    <tr><td>Desktop</td><td>18px</td><td>26.1px</td><td>-0.5px</td><td>16px</td></tr>
                  </tbody>
                </table>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>

        <div className="mt-10">
          <h5 className="mb-4">Standard Paragraph (Legacy)</h5>
          <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
            <code className="text-muted mb-3 d-block">p / default paragraph</code>
            <p>
              The standard paragraph element uses a base size of 16px with a 24px line height.
              This is the default for all unstyled paragraph text. The quick brown fox jumps over
              the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="text-muted">
              <small>Size: 16px · Line Height: 24px · Letter Spacing: 0px</small>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h5 className="mb-4">Longform Text (Legacy)</h5>
          <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
            <code className="text-muted mb-3 d-block">.longform · Medium Weight (500)</code>
            <div className="longform">
              Longform text is designed for extended reading experiences with larger sizing and
              medium weight. Perfect for article introductions or key content blocks.
            </div>
            <div className="mt-4 text-muted">
              <small>Mobile: 20px (line: 26px) · Desktop: 24px (line: 32px) · Weight: 500</small>
            </div>
          </div>
        </div>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Labels */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Label Text</h2>
          <h6 className="eyebrow mb-3">UI Elements</h6>
        </div>
        <p className="mb-10 text-muted">
          Label styles use the Booton sans-serif font family. Designed for UI elements, form labels, captions,
          and supplementary text. Smaller and optimized for clarity at reduced sizes.
        </p>

        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <code className="text-muted mb-3 d-block">label-r / .label-r · Booton Regular (400)</code>
                <div className="label-r mb-4">
                  Regular label text for form inputs, captions, and UI elements.
                  Maintains readability at smaller sizes.
                </div>
                <table className="w-100" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr className="text-muted">
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Breakpoint</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Size</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Line Height</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Letter Spacing</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>P-Space</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    <tr><td>Mobile/Tablet</td><td>14px</td><td>20.1px</td><td>0px</td><td>16px</td></tr>
                    <tr><td>Desktop</td><td>16px</td><td>23.2px</td><td>0px</td><td>16px</td></tr>
                  </tbody>
                </table>
              </div>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <code className="text-muted mb-3 d-block">label-l / .label-l · Booton Light (300)</code>
                <div className="label-l mb-4">
                  Light label text for secondary UI text, metadata, and supplementary information.
                  Provides subtle hierarchy.
                </div>
                <table className="w-100" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr className="text-muted">
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Breakpoint</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Size</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Line Height</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>Letter Spacing</th>
                      <th style={{ fontWeight: 'normal', paddingBottom: '4px' }}>P-Space</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    <tr><td>Mobile/Tablet</td><td>14px</td><td>20.1px</td><td>0px</td><td>16px</td></tr>
                    <tr><td>Desktop</td><td>16px</td><td>23.2px</td><td>0px</td><td>16px</td></tr>
                  </tbody>
                </table>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Special Styles */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Special Styles</h2>
          <h6 className="eyebrow mb-3">Distinctive Elements</h6>
        </div>

        <div className="d-flex flex-column gap-10">
          <div>
            <h5 className="mb-4">Eyebrow Text (Legacy)</h5>
            <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
              <code className="text-muted mb-3 d-block">.eyebrow</code>
              <div className="eyebrow">Brand Design System</div>
              <p className="mt-4 mb-0 text-muted">
                Small uppercase labels that appear above headings to provide context or categorization.
                Uses text-transform: uppercase with letter-spacing for visual distinction.
              </p>
            </div>
          </div>

          <div>
            <h5 className="mb-4">Numbers (Statistics) (Legacy)</h5>
            <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#141414', color: 'white' }}>
              <code className="mb-3 d-block" style={{ color: '#70EE97' }}>.numbers</code>
              <div className="numbers">1,234</div>
              <div className="mt-4" style={{ color: '#C1C1C2' }}>
                <p className="mb-2">Extra-large bold numbers for statistics and key metrics.</p>
                <small>Desktop: 96px (line: 104px) · Mobile: 62px (line: 70px) · Weight: Bold</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Font Families */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Font Families</h2>
          <h6 className="eyebrow mb-3">Type Stack</h6>
        </div>

        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <h5 className="mb-4">Booton</h5>
                <p className="mb-4 text-muted">Primary sans-serif font family</p>
                <div style={{ fontFamily: 'Booton, sans-serif', fontSize: '32px', lineHeight: '1.2' }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                  abcdefghijklmnopqrstuvwxyz<br />
                  0123456789
                </div>
                <div className="mt-4">
                  <p className="mb-2"><strong>Used for:</strong></p>
                  <ul className="mb-0">
                    <li>Display Large</li>
                    <li>All Subheads</li>
                    <li>Body Text</li>
                    <li>Labels</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
                <h5 className="mb-4">Tobias</h5>
                <p className="mb-4 text-muted">Monospace font family</p>
                <div style={{ fontFamily: 'Tobias, monospace', fontSize: '32px', lineHeight: '1.2' }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                  abcdefghijklmnopqrstuvwxyz<br />
                  0123456789
                </div>
                <div className="mt-4">
                  <p className="mb-2"><strong>Used for:</strong></p>
                  <ul className="mb-0">
                    <li>Display Medium & Small</li>
                    <li>All Headings</li>
                    <li>Legacy H1-H6</li>
                    <li>Code blocks</li>
                  </ul>
                </div>
              </div>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Responsive Behavior */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Responsive Behavior</h2>
          <h6 className="eyebrow mb-3">Breakpoint Adjustments</h6>
        </div>
        <p className="mb-6 text-muted">
          All typography styles automatically adjust across breakpoints for optimal readability on any device.
        </p>

        <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#f5f5f7' }}>
          <h5 className="mb-4">Breakpoint System</h5>
          <ul className="mb-4">
            <li><strong>Mobile:</strong> Base styles (0-767px)</li>
            <li><strong>Tablet:</strong> Medium breakpoint (768px-1023px)</li>
            <li><strong>Desktop:</strong> Large breakpoint (1024px+)</li>
            <li><strong>XL:</strong> Extra large (1200px+) — only used for Display Large</li>
          </ul>
          <p className="mb-0 text-muted">
            Resize your browser window to see typography scale responsively. Font sizes, line heights, 
            and letter spacing all adjust to maintain optimal readability at every viewport size.
          </p>
        </div>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Usage Guidelines */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Usage Guidelines</h2>
          <h6 className="eyebrow mb-3">Best Practices</h6>
        </div>

        <PageGrid>
          <PageGridRow>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <h5 className="mb-4">Do</h5>
              <ul>
                <li>Use Display styles sparingly for maximum impact</li>
                <li>Maintain consistent hierarchy with heading levels</li>
                <li>Pair Regular and Light weights for visual contrast</li>
                <li>Use Eyebrow text above headings for context</li>
                <li>Apply Longform class to article introductions</li>
                <li>Let typography breathe with adequate spacing</li>
              </ul>
            </PageGridCol>
            <PageGridCol span={{ base: 4, lg: 6 }}>
              <h5 className="mb-4">Don't</h5>
              <ul>
                <li>Don't skip heading levels in the hierarchy</li>
                <li>Don't use Display styles for body content</li>
                <li>Don't mix too many font weights on one screen</li>
                <li>Don't override letter spacing on Display text</li>
                <li>Don't use Tobias for long-form reading</li>
                <li>Don't ignore responsive scaling</li>
              </ul>
            </PageGridCol>
          </PageGridRow>
        </PageGrid>
      </section>

      <Divider color="gray" weight="thin" />

      {/* Code Examples */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse">
          <h2 className="h4 mb-8">Code Examples</h2>
          <h6 className="eyebrow mb-3">Implementation</h6>
        </div>
        <div className="p-6-sm p-10-until-sm br-8" style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4' }}>
          <pre style={{ margin: 0, overflow: 'auto' }}>
            <code>{`// Display Styles
<div className="display-lg">Largest headline</div>
<div className="display-md">Medium display</div>
<div className="display-sm">Small display</div>

// Headings
<div className="h-lg">Large heading</div>
<div className="h-md">Medium heading</div>
<div className="h-sm">Small heading</div>

// Or use semantic HTML
<h1>Heading Level 1</h1>
<h2>Heading Level 2</h2>

// Subheads
<div className="sh-lg-r">Large subhead regular</div>
<div className="sh-md-l">Medium subhead light</div>
<div className="sh-sm-r">Small subhead regular</div>

// Body Text
<div className="body-r">Regular body text</div>
<div className="body-l">Light body text</div>
<p className="longform">Extended reading text</p>

// Labels
<div className="label-r">UI label regular</div>
<div className="label-l">UI label light</div>

// Special Styles
<div className="eyebrow">Category Label</div>
<div className="numbers">1,234</div>`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}

