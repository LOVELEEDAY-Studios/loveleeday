#!/usr/bin/env python3
"""swap-site-photos.py : point pages at the graded photographs (ph-*.jpg, cards/ph-*.webp built by scripts/photos-build.sh)."""
import re
R = '/Users/danielmay/wt/ll-review-1026/public/site/'

def sub(path, pairs):
    s = open(R + path).read()
    for a, b in pairs:
        if a not in s:
            print('MISSING in', path, ':', a[:70])
        s = s.replace(a, b)
    open(R + path, 'w').write(s)

# municipal review: hero and closing band get different photographs
p = 'municipal-review.html'
s = open(R + p).read()
s = s.replace('<img src="/site/assets/municipal-review.jpg" alt="A classical civic building among trees">',
              '<img src="/site/assets/ph-municipal.jpg" alt="A document passed across a desk beside a calculator and a ledger">', 1)
s = s.replace('<img src="/site/assets/municipal-review.jpg" alt="A classical civic building among trees" loading="lazy">',
              '<img src="/site/assets/ph-municipal-2.jpg" alt="A records clerk handing a form across a counter" loading="lazy">', 1)
open(R + p, 'w').write(s)

sub('pricing-margins.html', [('<img src="/site/assets/pricing-margins.jpg" alt="A market stall stacked with produce in the evening" loading="lazy">',
                              '<img src="/site/assets/ph-pricing.jpg" alt="Hands counting cash beside a calculator and a receipt" loading="lazy">')])
sub('operating-system.html', [('<img src="/site/assets/operating-system.jpg" alt="A warm timber-lined room in afternoon light" loading="lazy">',
                               '<img src="/site/assets/ph-os.jpg" alt="A stockroom worker checking shelves against a clipboard" loading="lazy">')])
sub('industries.html', [
    ('/site/assets/cards/industry-property.webp', '/site/assets/cards/ph-property.webp'),
    ('/site/assets/cards/industry-government.webp', '/site/assets/cards/ph-government.webp'),
    ('<img src="/site/assets/cards/industry-property-2.webp" alt="A sunlit apartment complex with balconies and trees"', '<img src="/site/assets/cards/ph-property-2.webp" alt="A property manager holding out the keys to a unit"'),
    ('<img src="/site/assets/cards/industry-government-2.webp" alt="A town hall in daylight with its flags out front"', '<img src="/site/assets/cards/ph-government-2.webp" alt="A records clerk handing a form across a counter"'),
    ('/site/assets/cards/industry-schools.webp', '/site/assets/cards/ph-schools.webp'),
])
sub('industries/schools.html', [
    ('<img src="/site/assets/industry-schools.jpg" alt="A classroom with rows of desks, a whiteboard and a navy blue door" style="object-position:center 55%">',
     '<img src="/site/assets/ph-schools.jpg" alt="A school administrator talking with a student in a corridor" style="object-position:center 40%">'),
    ('/site/assets/cards/industry-government-2.webp', '/site/assets/cards/ph-government-2.webp'),
])
sub('industries/property.html', [
    ('<img src="/site/assets/industry-property.jpg" alt="A residential apartment block on a quiet street in the evening" style="object-position:center 45%">',
     '<img src="/site/assets/ph-property.jpg" alt="A property manager walking a prospective tenant through an empty unit" style="object-position:center 45%">'),
    ('/site/assets/cards/industry-government-2.webp', '/site/assets/cards/ph-government-2.webp'),
])
sub('industries/manufacturing.html', [('/site/assets/cards/industry-government-2.webp', '/site/assets/cards/ph-government-2.webp')])
# hero.css: the rejected hero photographs are replaced
sub('assets/fix/hero.css', [('hero-team-desktop.jpg', 'ph-home.jpg'), ('hero-team-phone.jpg', 'ph-home-phone.jpg')])
print('done')
