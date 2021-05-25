import { Address } from "../../src/entities/address/address.entity";
import { City } from "../../src/entities/address/city.enum";
import { Country } from "../../src/entities/address/country.enum";
import { Province } from "../../src/entities/address/province.enum";
import { Organization } from "../../src/entities/organization.entity";
import { AddressInput } from "../../src/types/address-input.type";
import { OrganizationInput } from "../../src/types/organization-input.type";

export class OrganizationMockedData {

  public static async getOrganization1(
    ): Promise<Organization> {
      const address: Address = new Address();
      address.street = "10600 Ave du bois-de-boulogne";
      address.postalCode = "H4T 2A1";

      const organization: Organization =  new Organization();
      organization.name = "Moisson Montreal";
      organization.url = "https://www.moissonmontreal.org/";
      organization.address = address;
      return organization;
  };

  public static async getOrganization2(
    ): Promise<Organization> {
      const address: Address = new Address();
      address.street = "10600 Ave du bois-de-boulogne";
      address.postalCode = "H4T 2A1";

      const organization: Organization =  new Organization();
      organization.name = "new Organization";
      organization.url = "https://www.kooora.com/";
      organization.address = address;

      return organization;
  };

  public static async getOrganization3(
    ): Promise<Organization> {
      const address: Address = new Address();
      address.street = "10600 Ave du bois-de-boulogne";
      address.postalCode = "H3M 2X6";
      address.appartmentNumber =  null;
      address.city = City.Montreal;
      address.country = Country.Canada;
      address.province = Province.Quebec;
      address.latitude = 45.5373255;
      address.longitude = -73.6768975;
      address.id = "2";

      const organization: Organization = new Organization();
      organization.name = "CLSC";
      organization.url = "https://santemontreal.qc.ca/en/public/montreals-institutions-at-a-glance/clscs/";
      organization.address = address;
      return organization;
  };

  public static async getOrganizationInput1(
    ): Promise<OrganizationInput> {
      const address: AddressInput = new AddressInput();

      address.street = "10600 Ave du bois-de-boulogne";
      address.postalCode = "H3A 1W7";

      const organizationInput: OrganizationInput = new OrganizationInput();
      organizationInput.address = address;
      organizationInput.name = "McGill Childcare Centre";
      organizationInput.url = "https://www.mcgill.ca/daycare/";

      return organizationInput;
  };
}
