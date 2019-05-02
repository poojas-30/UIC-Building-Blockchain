pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;
contract UICBuilding {
    
    address  owner;
    mapping(uint => Building) public building;
    uint public totalBuildings;
    
    modifier onlyOwner {
        require (msg.sender == owner);
        _;
    }
    

    struct Building{
        string buildingIndex;
        string buildingId;
        string buildingName;
        string buildingCode;
        string buildingAddress;
        string buildingBuiltDate;
        string buildingNASF;
        string buildingNUSF;
        string buldingGSF;
        string buildingCategory;
        string BuildingRegion;
    }
    
    constructor ()  public {
        owner = msg.sender;
    }


    function addBuilding(string memory _buildingIndex, 
                         string memory _buildingId, 
                         string memory _buildingName, 
                         string memory _buildingCode,
                         string memory _buildingAddress,
                         string memory _buildingBuiltDate,
                         string memory _buildingNASF,
                         string memory _buildingNUSF,
                         string memory _buldingGSF,
                         string memory _buildingCategory,
                         string memory _BuildingRegion ) public onlyOwner{
        totalBuildings++;
        building[totalBuildings] = Building(_buildingIndex, _buildingId, _buildingName, _buildingCode, _buildingAddress, _buildingBuiltDate, _buildingNASF, _buildingNUSF, _buldingGSF, _buildingCategory, _BuildingRegion);
    }

    function getBuilindingAddress(uint index) view public returns (Building memory){
        return building[index];
    }

    function checkIsAdmin() public returns (bool){
    	if(msg.sender == owner ){
    		return true;
    	}
    	return false;
    }
    
    function removeBuiding(uint _buildingIndex) public onlyOwner{
    	delete building[_buildingIndex];
        totalBuildings--;
    }
}
