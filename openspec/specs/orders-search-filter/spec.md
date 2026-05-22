# orders-search-filter Specification

## Purpose
TBD - created by archiving change orders-filter-by-id-and-customer. Update Purpose after archive.
## Requirements
### Requirement: Orders list supports text filter by id and customer fields
The system SHALL provide a text filter for orders that matches against order id, customer name, and customer email.

#### Scenario: Filter by order id
- **WHEN** user types text matching an order id
- **THEN** list shows orders whose id contains the query

#### Scenario: Filter by customer name
- **WHEN** user types text matching customer first name, last name, or full name
- **THEN** list shows orders whose customer name contains the query

#### Scenario: Filter by customer email
- **WHEN** user types text matching customer email
- **THEN** list shows orders whose customer email contains the query

### Requirement: Text filter matching is case-insensitive
The system SHALL evaluate order id and customer field matches case-insensitively.

#### Scenario: Case-insensitive match
- **WHEN** user query casing differs from stored order/customer values
- **THEN** matching orders are still included in results

